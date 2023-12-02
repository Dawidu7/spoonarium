import { eq } from "drizzle-orm"
import type { Adapter, InitializeAdapter } from "lucia"
import { db } from "../db"
import { keys, sessions, users } from "../db/schema"

type Error = {
  code: string
  message: string
}

export default function adapter(): InitializeAdapter<Adapter> {
  return LuciaError => ({
    getUser: async userId =>
      await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .then(row => row[0]),
    setUser: async (user, key) => {
      if (!key) {
        await db.insert(users).values(user)
        return
      }
      try {
        await db.transaction(async tx => {
          await tx.insert(users).values(user)
          await tx.insert(keys).values(key)
        })
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2002" && error.message?.includes("`id`")) {
          throw new LuciaError("AUTH_DUPLICATE_KEY_ID")
        }
        throw error
      }
    },
    deleteUser: async userId => {
      try {
        await db.delete(users).where(eq(users.id, userId))
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2025") {
          return
        }
        throw error
      }
    },
    updateUser: async (userId, partialUser) => {
      await db.update(users).set(partialUser).where(eq(users.id, userId))
    },
    getSession: async sessionId =>
      await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId))
        .limit(1)
        .then(rows => rows[0] ?? null),
    getSessionsByUserId: async userId =>
      await db.select().from(sessions).where(eq(sessions.user_id, userId)),
    setSession: async session => {
      try {
        await db.insert(sessions).values(session)
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2003") {
          throw new LuciaError("AUTH_INVALID_USER_ID")
        }
        throw error
      }
    },
    deleteSession: async sessionId => {
      try {
        await db.delete(sessions).where(eq(sessions.id, sessionId))
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2025") {
          return
        }
        throw error
      }
    },
    deleteSessionsByUserId: async userId => {
      await db.delete(sessions).where(eq(sessions.user_id, userId))
    },
    updateSession: async (sessionId, partialSession) => {
      await db
        .update(sessions)
        .set(partialSession)
        .where(eq(sessions.id, sessionId))
    },
    getKey: async keyId =>
      await db
        .select()
        .from(keys)
        .where(eq(keys.id, keyId))
        .limit(1)
        .then(rows => rows[0] ?? null),
    getKeysByUserId: async userId =>
      await db.select().from(keys).where(eq(keys.user_id, userId)),
    setKey: async key => {
      try {
        await db.insert(keys).values(key)
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2003") {
          throw new LuciaError("AUTH_INVALID_USER_ID")
        }
        if (error.code === "P2002" && error.message?.includes("`id`")) {
          throw new LuciaError("AUTH_DUPLICATE_KEY_ID")
        }
        throw error
      }
    },
    deleteKey: async keyId => {
      try {
        await db.delete(keys).where(eq(keys.id, keyId))
      } catch (e) {
        const error = e as Partial<Error>

        if (error.code === "P2025") {
          return
        }
        throw error
      }
    },
    deleteKeysByUserId: async userId => {
      await db.delete(keys).where(eq(keys.user_id, userId))
    },
    updateKey: async (keyId, partialKey) => {
      await db.update(keys).set(partialKey).where(eq(keys.id, keyId))
    },
  })
}
