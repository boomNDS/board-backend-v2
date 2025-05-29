import { Comment, User } from "@prisma/client"
import { createMockUser } from "../../users/factories/user.factory"

type CommentWithUser = Comment & {
  user?: Pick<User, "id" | "username" | "email">
  children?: CommentWithUser[]
}

export const createMockComment = (
  overrides: Partial<CommentWithUser> = {},
): CommentWithUser => {
  const mockUser = createMockUser()
  const defaultComment: CommentWithUser = {
    id: 1,
    content: "Test comment",
    userId: mockUser.id,
    postId: 1,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  }

  return {
    ...defaultComment,
    ...overrides,
  }
}

export const createMockComments = (
  count: number,
  overrides: Partial<CommentWithUser> = {},
): CommentWithUser[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockComment({
      id: index + 1,
      content: `Test comment ${index + 1}`,
      ...overrides,
    }),
  )
}
