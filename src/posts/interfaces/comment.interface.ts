export interface Comment {
  id: number
  content: string
  createdAt: Date
  user: { id: number; username: string }
  children?: Comment[]
}
