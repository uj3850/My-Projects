import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameHistory = pgTable("game_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageName: text("image_name").notNull(),
  moves: integer("moves").notNull(),
  timeElapsed: integer("time_elapsed").notNull(), // in seconds
  difficulty: text("difficulty").notNull().default("3x3"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const customImages = pgTable("custom_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  processedPath: text("processed_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertGameHistorySchema = createInsertSchema(gameHistory).omit({
  id: true,
  completedAt: true,
});

export const insertCustomImageSchema = createInsertSchema(customImages).omit({
  id: true,
  uploadedAt: true,
});

export type GameHistory = typeof gameHistory.$inferSelect;
export type InsertGameHistory = z.infer<typeof insertGameHistorySchema>;
export type CustomImage = typeof customImages.$inferSelect;
export type InsertCustomImage = z.infer<typeof insertCustomImageSchema>;

// Game state types
export type PuzzleTile = {
  id: number;
  position: number;
  isEmpty: boolean;
};

export type GameState = {
  tiles: PuzzleTile[];
  moves: number;
  startTime: number | null;
  isPlaying: boolean;
  isWon: boolean;
  currentImage: string;
  difficulty: string;
};

export type PresetImage = {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
};
