import { Community } from "../enums/community.enum"
import { Comment } from "./comment.interface"

export interface IPost {
  id: number
  title: string
  community: Community
  content: string
  userId: number
  createdAt: Date
  updatedAt: Date
  user?: { id: number; username: string }
  comments?: Comment[]
}
