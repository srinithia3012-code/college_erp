import {
  pgTable,
  varchar,
  uuid,
  numeric,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// ---------------- FACULTY ----------------
export const faculty = pgTable("faculty", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: varchar("first_name", { length: 50 }).notNull(),
  last_name: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  department: varchar("department", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
});

// ---------------- COURSES ----------------
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  description: text("description"),
  faculty_id: uuid("faculty_id").notNull(), // foreign key → faculty.id
});

// ---------------- STUDENTS ----------------
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: varchar("first_name", { length: 50 }).notNull(),
  last_name: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  enrollment_no: varchar("enrollment_no", { length: 20 }).notNull(),
  course_id: uuid("course_id").notNull(),
  phone: varchar("phone", { length: 30 }),
  address: text("address"),
  created_at: timestamp("created_at").defaultNow(),
});

// ---------------- ATTENDANCE ----------------
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: uuid("student_id").notNull(), // foreign key → students.id
  course_id: uuid("course_id").notNull(),   // foreign key → courses.id
  date: timestamp("date").defaultNow(),
  status: boolean("status").notNull(), // true = present, false = absent
});

// ---------------- EXAM RESULTS ----------------
export const results = pgTable("results", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: uuid("student_id").notNull(), // foreign key → students.id
  course_id: uuid("course_id").notNull(),   // foreign key → courses.id
  exam_type: varchar("exam_type", { length: 50 }).notNull(), // internal/final
  marks_obtained: numeric("marks_obtained").notNull(),
  max_marks: numeric("max_marks").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// ---------------- FEES ----------------
export const fees = pgTable("fees", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: uuid("student_id").notNull(), // foreign key → students.id
  amount: numeric("amount").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // paid/unpaid
  paid_on: timestamp("paid_on"),
});
