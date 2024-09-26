import { PrismaService } from '@api/main/prisma/prisma.service';
import { RedisService } from '@api/main/redis/redis.service';
import { FtpService } from '@api/mcs/file/ftp.service';
import { Checkout, CreateTeamDto, UpdateTeamDto, UpdateTeamMemberRoleDto } from './addon/team.dto';
import { TeamEntity } from './addon/team.entity';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { TeamStandart } from './addon/team.standart';
import { TeamAlreadyExist, TeamIsCloseToEveryone, TeamIsFreeToJoin, TeamLimitException, TeamMemberRoleExistException, TooManyQRCodes } from '../application/addon/error';
import { UserEntity } from '../user/addon/user.entity';
import { λthrow } from '@impactium/utils';
import { TeamMemberEntity } from './addon/team.member.entity';
import { $Enums, Joinable, TeamInvite } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ftpService: FtpService,
    private readonly redisService: RedisService
  ) {}

  async create(
    { indent, uid }: Checkout,
    team: CreateTeamDto,
    logo?: Express.Multer.File
  ) {
    await this.findManyByUid(uid)
      .then(teams => {
        if (teams.length >= 3) throw new TeamLimitException();
      })
    
    await this.findOneByIndent(indent).then(team => {
      if (team) throw new TeamAlreadyExist();
    });

    return this.prisma.team.create({
      data: {
        title: team.title,
        indent,
        joinable: team.joinable,
        logo: await this.uploadLogo(indent, logo),
        owner: {
          connect: {
            uid,
          }
        }
      }
    });
  }

  async update(
    team: TeamEntity,
    update: UpdateTeamDto,
    logo?: Express.Multer.File
  ) {
    
    if (logo) {
      update.logo = await this.uploadLogo(update.indent || team.indent, logo);
      if (team.logo && team.logo !== update.logo) await this.deleteLogo(team);
    } else if (update.indent && update.indent !== team.indent) {
      update.logo = await this.renameLogo(team, update.indent)
    }

    return this.prisma.team.update({
      where: { indent: team.indent },
      data: update,
      select: TeamEntity.select({ members: true, owner: true, tournaments: true })
    });
  }
  
  delete(user: UserEntity, indent: string) {
    return this.prisma.team.delete({
      where: { indent, ownerId: user.uid }
    })
  }

  async setLogo(indent: string, logo: Express.Multer.File) {
    return this.prisma.team.update({
      where: {
        indent
      },
      data: {
        logo: logo && await this.uploadLogo(indent, logo)
      }
    })
  }

  findManyByUid(uid: string): Promise<TeamEntity[]> {
    return this.prisma.team.findMany({
      where: {
        ownerId: uid
      }
    })
  }

  findOneByIndent(indent: TeamEntity['indent']) {
    return this.prisma.team.findUnique({
      select: TeamEntity.select({ members: true, owner: true, tournaments: true }),
      where: {
        indent,
      },
    });
  }
  
  findManyByTitleOrIndent(value: NonNullable<TeamEntity['indent'] | TeamEntity['title']>) {
    return this.prisma.team.findMany({
      where: {
        OR: [
          { title: { contains: value } },
          { indent: { contains: value.toLowerCase() } }
        ]
      },
      select: TeamEntity.select({ members: true }),
      take: TeamStandart.DEFAULT_PAGINATION_LIMIT
    });
  }
  
  async pagination(
    limit: number = TeamStandart.DEFAULT_PAGINATION_LIMIT,
    skip: number = TeamStandart.DEFAULT_PAGINATION_PAGE,
  ): Promise<TeamEntity[]> {
    return this.prisma.team.findMany({
      select: TeamEntity.select({ members: true }),
      take: limit,
      skip: skip,
    });
  }

  async setMemberRole(team: TeamEntity, { id, role }: UpdateTeamMemberRoleDto) {
    const isMemberWithExactRoleExist = team.members
      ? team.members.some(member => member.id !== id && member.role === role)
      : await this.prisma.teamMember.findMany({
          where: { team: { indent: team.indent } },
          select: {
            role: true
          }
        }).then(members => members.some(member => member.role === role));

    if (isMemberWithExactRoleExist) λthrow(TeamMemberRoleExistException);

    return await this.prisma.teamMember.update({
      where: {
        id,
        team: { indent: team.indent }
      },
      data: { role }
    })
  }
  
  kickMember(team: TeamEntity, id: TeamMemberEntity['id']) {
    return this.prisma.teamMember.delete({
      where: { id, team: { indent: team.indent } }
    });
  }

  invites(team: TeamEntity) {
    return this.prisma.teamInvite.findMany({
      where: { indent: team.indent }
    })
  }
  
  async newInvite(team: TeamEntity, maxUses?: number) {
    if (team.joinable === Joinable.Free) λthrow(TeamIsFreeToJoin)
    if (team.joinable === Joinable.Closed) λthrow(TeamIsCloseToEveryone)

    const amount = await this.prisma.teamInvite.findMany({
      where: { indent: team.indent }
    });
    
    if (amount.length >= 5) λthrow(TooManyQRCodes);

    return this.prisma.teamInvite.create({
      data: { indent: team.indent, maxUses }
    })
  }

  deleteInvite(team: TeamEntity, id: TeamInvite['id']) {
    return this.prisma.teamInvite.delete({
      where: { indent: team.indent, id }
    })
  }

  private async uploadLogo(indent: TeamEntity['indent'], logo?: Express.Multer.File): Promise<string | undefined> {
    const stream = new Readable();
    if (!logo) return undefined;
    stream.push(logo.buffer);
    stream.push(null);

    const extension = logo.originalname.split('.').pop();
    const { ftp, cdn } = TeamEntity.getLogoPath(`${indent}.${extension}`);
    await this.ftpService.uploadFile(ftp, stream);

    return cdn;
  }

  private async renameLogo(team: TeamEntity, newIndent: TeamEntity['indent']): Promise<string | undefined> {
    if (!team.logo) return;

    const old = TeamEntity.getLogoPath(team.logo.split('/').pop()!);
    const _new = TeamEntity.getLogoPath(`${newIndent}.${team.logo.split('.').pop()}`);
    await this.ftpService.rename(old.ftp, _new.ftp);

    return _new.cdn;
  }

  private deleteLogo =(team: TeamEntity) => this.ftpService.remove(TeamEntity.getLogoPath(team.logo!.split('/').pop()!).ftp, true);
}
