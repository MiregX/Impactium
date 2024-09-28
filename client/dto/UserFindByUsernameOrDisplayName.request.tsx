import { UserEntity } from "./User";

export class UserFindByUsernameOrDisplayNameRequest {
 static create = (search: UserEntity['displayName'] | UserEntity['username']) => JSON.stringify({ search })
}