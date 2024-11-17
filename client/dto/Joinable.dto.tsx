import { Icon } from "@impactium/icons";

export enum Joinable {
  Free = 'Free',
  Invites = 'Invites',
  Closed = 'Closed'
}

export const JoinableIcons: Record<Joinable, Icon.Name> = {
  [Joinable.Free]: 'DoorOpen',
  [Joinable.Invites]: 'TicketPercent',
  [Joinable.Closed]: 'DoorClosed'
}