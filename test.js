
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { addNewUserToDB, createFolderInDB } from "./db/user";
export const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mPrisma = {
    user: { create: jest.fn() },
    folder: { create: jest.fn() }, // keep both here
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});


describe('createFolderInDB', () => {
  const mockData = {
    id: 1,
    ownerId: 1,
    parentId: 1,
    name: 'My Folder',
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Creates a folder correctly', async () => {
    prisma.folder.create.mockResolvedValue(mockData);

    const result = await createFolderInDB(
     mockData.ownerId,
      mockData.parentId,
      mockData.name,
    );

    expect(result).toEqual(mockData);
    expect(prisma.folder.create).toHaveBeenCalledTimes(1);
    expect(prisma.folder.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ownerId: 1,
        parentId: 1,
        name: 'My Folder',
      }),
    });
  });

  it('throws if prisma.folder.create fails', async () => {
    prisma.folder.create.mockRejectedValue(new Error('DB error'));
    await expect(
      createFolderInDB(1, 1, 'My folder')
    ).rejects.toThrow("DB error");
  })

});


describe("addNewUserToDB", () => {
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    passwordHash: "hashedpassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hashes the password and saves the user", async () => {
    // mockResolvedValue is specifically for async functions (functions that return promises).
    prisma.user.create.mockResolvedValue(mockUser);

    const result = await addNewUserToDB(
      "John",
      "Doe",
      "john@example.com",
      "plainpassword"
    );

    // Check bcrypt was used
    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        passwordHash: expect.any(String), 
      }),
    });

    // Ensure the hash isn’t the plain password
    const { passwordHash } = prisma.user.create.mock.calls[0][0].data;
    const isSame = await bcrypt.compare("plainpassword", passwordHash);
    expect(isSame).toBe(true);
  });

  it("throws if prisma.user.create fails", async () => {
    // here, prisma.user.create will behave as if the database threw an error, and the test can check whether (addNewUserToDB) handles that error correctly
    prisma.user.create.mockRejectedValue(new Error("DB error"));

    await expect(
      addNewUserToDB("Jane", "Doe", "jane@example.com", "password")
    ).rejects.toThrow("DB error");
  });
});

