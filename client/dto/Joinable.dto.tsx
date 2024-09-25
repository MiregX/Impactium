import { λIcon } from "@/lib/utils";

export enum Joinable {
  Free = 'Free',
  Invite = 'Invite',
  Closed = 'Closed'
}

export const JoinableIcons: Record<Joinable, λIcon> = {
  [Joinable.Free]: 'DoorOpen',
  [Joinable.Invite]: 'QrCode',
  [Joinable.Closed]: 'DoorClosed'
}