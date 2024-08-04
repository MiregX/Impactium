import { Prisma, $Enums } from "@prisma/client";

export class CreateLoginDto implements Prisma.LoginCreateWithoutUserInput {
  id?: string;
  type: $Enums.LoginType;
  on?: string | Date;
  avatar?: string;
  displayName?: string;
}

export class UpdateLoginDto implements Prisma.LoginUpdateInput {
  avatar?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  displayName?: string | Prisma.StringFieldUpdateOperationsInput;
  locale?: string | Prisma.StringFieldUpdateOperationsInput;
}
