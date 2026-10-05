import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Owner OAuth identity used exclusively for administration. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** One profile per normalized email AND one per canonical mobile. */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  studentCode: varchar("student_code", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  mobile: varchar("mobile", { length: 16 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 12 }).notNull(),
  gender: varchar("gender", { length: 40 }).notNull(),
  educationLevel: varchar("education_level", { length: 80 }).notNull(),
  defenceEntry: varchar("defence_entry", { length: 80 }).notNull(),
  targetExam: varchar("target_exam", { length: 120 }),
  attemptYear: varchar("attempt_year", { length: 10 }),
  previousSsbExperience: varchar("previous_ssb_experience", { length: 80 }),
  state: varchar("state", { length: 80 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("Active"),
  consentAt: bigint("consent_at", { mode: "number" }).notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  lastLoginAt: bigint("last_login_at", { mode: "number" }),
});
export type Student = typeof students.$inferSelect;

export const studentSessions = mysqlTable("student_sessions", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
});

export const assessmentAttempts = mysqlTable("assessment_attempts", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: varchar("attempt_id", { length: 36 }).notNull().unique(),
  studentId: int("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  testSlug: varchar("test_slug", { length: 32 }).notNull(),
  testName: varchar("test_name", { length: 120 }).notNull(),
  score: int("score").notNull(),
  percentage: int("percentage").notNull(),
  status: varchar("status", { length: 24 }).notNull().default("completed"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const managedTests = mysqlTable("managed_tests", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  duration: int("duration").notNull().default(0),
  difficulty: varchar("difficulty", { length: 32 }).notNull().default("Mixed"),
  status: varchar("status", { length: 24 }).notNull().default("draft"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});
export const managedQuestions = mysqlTable("managed_questions", {
  id: int("id").autoincrement().primaryKey(),
  testId: int("test_id").references(() => managedTests.id, { onDelete: "set null" }),
  prompt: text("prompt").notNull(),
  questionType: varchar("question_type", { length: 60 }).notNull(),
  formatLabel: varchar("format_label", { length: 100 }).notNull(),
  options: text("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  difficulty: varchar("difficulty", { length: 32 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("published"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

/** Migrated legacy admin credentials; never joined with public student accounts. */
export const adminAccounts = mysqlTable("admin_accounts", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 30 }).notNull().default("admin"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  lastLoginAt: bigint("last_login_at", { mode: "number" }),
});
export const adminSessions = mysqlTable("admin_sessions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("admin_id").notNull().references(() => adminAccounts.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
});
export const authRateLimits = mysqlTable("auth_rate_limits", {
  keyHash: varchar("key_hash", { length: 64 }).primaryKey(),
  failures: int("failures").notNull().default(0),
  windowStart: bigint("window_start", { mode: "number" }).notNull(),
  blockedUntil: bigint("blocked_until", { mode: "number" }).notNull().default(0),
});
