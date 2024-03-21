import { Prisma, $Enums } from "@prisma/client";

export class CreateLoginDto implements Prisma.LoginCreateInput {
  id: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  locale: string;
  user: Prisma.UserCreateNestedOneWithoutLoginsInput;
}

export class UpdateLoginDto implements Prisma.LoginUpdateInput {
  avatar?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  displayName?: string | Prisma.StringFieldUpdateOperationsInput;
  locale?: string | Prisma.StringFieldUpdateOperationsInput;
}
