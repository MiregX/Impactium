import { λIcon } from "@/lib/utils";

export enum Joinable {
  Free = 'Free',
  Invites = 'Invites',
  Closed = 'Closed'
}

export const JoinableIcons: Record<Joinable, λIcon> = {
  [Joinable.Free]: 'DoorOpen',
  [Joinable.Invites]: 'TicketPercent',
  [Joinable.Closed]: 'DoorClosed'
}