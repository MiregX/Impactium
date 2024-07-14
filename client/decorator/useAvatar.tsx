import { User } from "@/dto/User";

export const useAvatar = (user: User | null) => user?.avatar || user?.login?.avatar || '';