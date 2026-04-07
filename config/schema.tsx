
import { date, integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(20)
});

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId:varchar({ length: 255 }).notNull(),
  projectName:varchar({ length: 255 }),
  theme:varchar({ length: 255 }),
  userInput:varchar(),
  device:varchar(),
  createdOn:date().defaultNow(),
  config:json(),
  projectVisualDescription:text(),
  userId:varchar().references(() => usersTable.email).notNull()
});

export const screensConfigTable = pgTable("screenConfig", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId:varchar({ length: 255 }).references(() => projectsTable.projectId).notNull(),
  screenId:varchar({ length: 255 }).notNull(),
  screenName:varchar({ length: 255 }),
  purpose:varchar(),
  screenDescription:varchar(),
  code:text()
})
