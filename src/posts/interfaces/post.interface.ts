import { Community } from "../enums/community.enum"

export interface IPost {
  id: number
  title: string
  community: Community
  content: string
  userId: number
  createdAt: Date
  updatedAt: Date
}
