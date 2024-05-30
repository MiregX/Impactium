export interface ChangelogWithoutOwner {
  id: string;
  on: Date;
  new: string;
}

export type Changelog = ChangelogWithoutOwner | ChangelogWithoutOwner & {
  ownerId: string
  owner: string
}