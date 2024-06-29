import { User } from "@/dto/User";

globalThis.useUsername = (user: User) => `@${user.username || user.login.id}`