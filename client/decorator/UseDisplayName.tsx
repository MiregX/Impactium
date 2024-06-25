import { User } from "@/dto/User";

globalThis.useDisplayName = (user: User): string => user.displayName || user.login.displayName