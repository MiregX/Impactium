import { User } from "./User";

export class UpdateUserRequest {
  public static create = (user: Partial<User>) => JSON.stringify(user);
}