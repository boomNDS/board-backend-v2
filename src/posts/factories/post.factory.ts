import { Post, User } from "@prisma/client"
import { createMockUser } from "../../users/factories/user.factory"
import { Community } from "../enums/community.enum"

type PostWithUser = Post & {
  user?: Pick<User, "id" | "username" | "email">
}

export const createMockPost = (
  overrides: Partial<PostWithUser> = {},
): PostWithUser => {
  const mockUser = createMockUser()
  const defaultPost: PostWithUser = {
    id: 1,
    title: "Test Post",
    content: "This is a test post content",
    userId: mockUser.id,
    community: Community.OTHERS,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
    },
  }

  return {
    ...defaultPost,
    ...overrides,
  }
}

export const createMockPosts = (
  count: number,
  overrides: Partial<PostWithUser> = {},
): PostWithUser[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockPost({
      id: index + 1,
      title: `Test Post ${index + 1}`,
      content: `This is test post content ${index + 1}`,
      ...overrides,
    }),
  )
}
