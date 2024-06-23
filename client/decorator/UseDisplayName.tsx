import { User } from "@/dto/User";

globalThis.UseDisplayName = (user: User): string => user.displayName || user.login.displayName