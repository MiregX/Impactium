import { Prisma } from '@prisma/client'

export type CommentTypeDto = 'team'

export class CommentDto implements Prisma.CommentCreateInput {
  content: string
  user: Prisma.UserCreateNestedOneWithoutCommentsInput
}