import { $Enums, Prisma } from "@prisma/client";
import { CreateLoginDto } from "../dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { RequestTimeoutException } from "@nestjs/common";

export class LoginEntity {
  static readonly prisma: PrismaService;
}
