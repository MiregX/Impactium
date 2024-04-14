import { Prisma, $Enums } from "@prisma/client";

export class CreateLoginDto implements Prisma.LoginCreateWithoutUserInput {
  id?: string;
  type: $Enums.LoginType;
  avatar?: string;
  displayName: string;
  locale: string;
}

export class UpdateLoginDto implements Prisma.LoginUpdateInput {
  avatar?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  displayName?: string | Prisma.StringFieldUpdateOperationsInput;
  locale?: string | Prisma.StringFieldUpdateOperationsInput;
}
