import { User } from "@prisma/client"

export const createMockUser = (overrides: Partial<User> = {}): User => {
  const defaultUser: User = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    password: "hashedPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return {
    ...defaultUser,
    ...overrides,
  }
}

export const createMockUsers = (
  count: number,
  overrides: Partial<User> = {},
): User[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: index + 1,
      username: `testuser${index + 1}`,
      email: `test${index + 1}@example.com`,
      ...overrides,
    }),
  )
}
