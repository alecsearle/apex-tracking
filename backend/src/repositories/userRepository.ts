import { prisma } from "../config/prisma";

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  /**
   * Sync a Supabase auth user into the local users table.
   * Handles re-registration: if the email exists with a different Supabase auth ID
   * (e.g. user deleted their account and re-signed up), delete the stale record
   * and create a fresh one. Cascade deletes clean up orphaned memberships.
   */
  async upsert(data: { id: string; email: string; fullName?: string; avatarUrl?: string }) {
    try {
      return await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email: data.email,
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
        },
        create: {
          id: data.id,
          email: data.email,
          fullName: data.fullName || data.email.split("@")[0],
          avatarUrl: data.avatarUrl,
        },
      });
    } catch (err: unknown) {
      // P2002 on email: user re-registered with a new Supabase auth ID.
      // Delete the stale record (cascades to old memberships) and create fresh.
      if ((err as { code?: string }).code === "P2002") {
        return prisma.$transaction(async (tx) => {
          await tx.user.delete({ where: { email: data.email } });
          return tx.user.create({
            data: {
              id: data.id,
              email: data.email,
              fullName: data.fullName || data.email.split("@")[0],
              avatarUrl: data.avatarUrl,
            },
          });
        });
      }
      throw err;
    }
  },
};
