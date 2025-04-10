import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const babies = pgTable("babies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birthday: date("birthday").notNull(),
  weight: text("weight").notNull(),
  height: text("height").notNull(),
  feedingType: text("feeding_type").notNull(),
  restrictions: text("restrictions").array().notNull(),
  userId: integer("user_id").notNull(),
});

export const feedingLogs = pgTable("feeding_logs", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  time: text("time").notNull(),
  foodType: text("food_type").notNull(),
  foodName: text("food_name").notNull(),
  amount: text("amount").notNull(),
  notes: text("notes"),
  babyId: integer("baby_id").notNull(),
});

export const growthRecords = pgTable("growth_records", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  weight: text("weight").notNull(),
  height: text("height").notNull(),
  notes: text("notes"),
  babyId: integer("baby_id").notNull(),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ageRange: text("age_range").notNull(),
  description: text("description").notNull(),
  completed: boolean("completed").default(false),
  completedDate: date("completed_date"),
  babyId: integer("baby_id").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Zod Schemas
export const insertBabySchema = createInsertSchema(babies).omit({ id: true });
export const insertFeedingLogSchema = createInsertSchema(feedingLogs).omit({ id: true });
export const insertGrowthRecordSchema = createInsertSchema(growthRecords).omit({ id: true });
export const insertMilestoneSchema = createInsertSchema(milestones).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

// Types
export type Baby = typeof babies.$inferSelect;
export type InsertBaby = z.infer<typeof insertBabySchema>;

export type FeedingLog = typeof feedingLogs.$inferSelect;
export type InsertFeedingLog = z.infer<typeof insertFeedingLogSchema>;

export type GrowthRecord = typeof growthRecords.$inferSelect;
export type InsertGrowthRecord = z.infer<typeof insertGrowthRecordSchema>;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
