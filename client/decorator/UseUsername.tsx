import { User } from "@/dto/User";

globalThis.UseUsername = (user: User) => user.username || user.login.id