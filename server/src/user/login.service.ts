import { Injectable } from "@nestjs/common"
import { LoginEntity } from "./entities/login.entity";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLoginDto } from "./dto/login.dto";

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  findUniqueOrCreate(createLogin: CreateLoginDto): Promise<LoginEntity> {
    return this.prisma.login.upsert({
      where: { id: createLogin.id },
      update: createLogin,
      create: createLogin,
    });    
  }
}