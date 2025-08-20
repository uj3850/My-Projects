import { type GameHistory, type InsertGameHistory, type CustomImage, type InsertCustomImage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Game history methods
  saveGameHistory(game: InsertGameHistory): Promise<GameHistory>;
  getGameHistory(limit?: number): Promise<GameHistory[]>;
  
  // Custom image methods
  saveCustomImage(image: InsertCustomImage): Promise<CustomImage>;
  getCustomImages(): Promise<CustomImage[]>;
  getCustomImageById(id: string): Promise<CustomImage | undefined>;
}

export class MemStorage implements IStorage {
  private gameHistory: Map<string, GameHistory>;
  private customImages: Map<string, CustomImage>;

  constructor() {
    this.gameHistory = new Map();
    this.customImages = new Map();
  }

  async saveGameHistory(insertGame: InsertGameHistory): Promise<GameHistory> {
    const id = randomUUID();
    const game: GameHistory = {
      ...insertGame,
      id,
      difficulty: insertGame.difficulty || "3x3",
      completedAt: new Date(),
    };
    this.gameHistory.set(id, game);
    return game;
  }

  async getGameHistory(limit = 10): Promise<GameHistory[]> {
    const games = Array.from(this.gameHistory.values())
      .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
      .slice(0, limit);
    return games;
  }

  async saveCustomImage(insertImage: InsertCustomImage): Promise<CustomImage> {
    const id = randomUUID();
    const image: CustomImage = {
      ...insertImage,
      id,
      uploadedAt: new Date(),
    };
    this.customImages.set(id, image);
    return image;
  }

  async getCustomImages(): Promise<CustomImage[]> {
    return Array.from(this.customImages.values())
      .sort((a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0));
  }

  async getCustomImageById(id: string): Promise<CustomImage | undefined> {
    return this.customImages.get(id);
  }
}

export const storage = new MemStorage();
