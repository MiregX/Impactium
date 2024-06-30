import { Tournament } from "./Tournament";

export interface Application {
  tournaments: Tournament[]
}

export const ApplicationBase: Application = {
  tournaments: []
}