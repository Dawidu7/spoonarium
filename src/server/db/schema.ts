import { sql } from "drizzle-orm"
import type { InferInsertModel } from "drizzle-orm"
import {
  bigint,
  boolean,
  datetime,
  int,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core"

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 15 }).unique(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    isStaff: boolean("is_staff").default(false).notNull(),
  },
  t => ({
    unq: unique().on(t.firstName, t.lastName),
  }),
)

export const keys = mysqlTable("keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user_id: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hashed_password: varchar("hashed_password", { length: 255 }),
})

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  user_id: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  active_expires: bigint("active_expires", { mode: "number" }).notNull(),
  idle_expires: bigint("idle_expires", { mode: "number" }).notNull(),
})

export const authors = mysqlTable("authors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
})

export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  isbn: varchar("isbn", { length: 13 }).notNull().unique(),
  year: int("year").notNull(),
  copies: int("copies").notNull(),
  coverUrl: varchar("cover_url", { length: 255 }),
  blurb: text("blurb"),
})

export const genres = mysqlTable("genres", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
})

export const bookAuthors = mysqlTable(
  "book_authors",
  {
    authorId: int("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
  },
  t => ({
    pk: primaryKey({ columns: [t.authorId, t.bookId] }),
  }),
)

export const bookGenres = mysqlTable(
  "book_genres",
  {
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    genreId: int("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  t => ({
    pk: primaryKey({ columns: [t.bookId, t.genreId] }),
  }),
)

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  checkoutDate: datetime("checkout_date")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  dueDate: datetime("due_date").notNull(),
  returnDate: datetime("return_date"),
  bookId: int("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export type User = InferInsertModel<typeof users>
export type Key = InferInsertModel<typeof keys>
export type Session = InferInsertModel<typeof sessions>
export type Author = InferInsertModel<typeof authors>
export type Book = InferInsertModel<typeof books>
export type Genre = InferInsertModel<typeof genres>
export type BookAuthor = InferInsertModel<typeof bookAuthors>
export type BookGenre = InferInsertModel<typeof bookGenres>
export type Transaction = InferInsertModel<typeof transactions>
