export interface Tournament {
  indent: string,
  logo: null | string,
  title: string,
  ownerId: string,
  description: string,
  membersAmount: number,
  members?: Array<null>,
  comments: Array<Comment>
}