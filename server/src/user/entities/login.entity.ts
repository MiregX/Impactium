import { $Enums, Login } from "@prisma/client";
import { CreateLoginDto } from "../dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { RequestTimeoutException } from "@nestjs/common";

interface LoginEntityInput extends Login {

}

export class LoginEntity implements LoginEntityInput {
  id: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  locale: string;
  userId: string;
}
