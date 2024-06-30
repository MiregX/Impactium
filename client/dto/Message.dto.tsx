import { MessageTypes } from "./MessateTypes.dto";

export interface Message {
  id: number,
  status: MessageTypes,
  msg: string,
  hidden?: boolean
}