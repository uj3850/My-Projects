import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { insertGameHistorySchema, insertCustomImageSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get game history
  app.get("/api/game-history", async (req, res) => {
    try {
      const history = await storage.getGameHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  // Save game result
  app.post("/api/game-history", async (req, res) => {
    try {
      const validatedData = insertGameHistorySchema.parse(req.body);
      const game = await storage.saveGameHistory(validatedData);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  // Upload and process custom image
  app.post("/api/upload-image", upload.single('image'), async (req: Request & { file?: any }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const { originalname, buffer } = req.file;
      const fileExtension = path.extname(originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Process image to 400x400 square
      const processedBuffer = await sharp(buffer)
        .resize(400, 400, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Save processed image
      await fs.promises.writeFile(filePath, processedBuffer);

      // Save to storage
      const imageData = {
        fileName,
        originalName: originalname,
        processedPath: `/uploads/${fileName}`,
      };

      const validatedData = insertCustomImageSchema.parse(imageData);
      const savedImage = await storage.saveCustomImage(validatedData);

      res.json(savedImage);
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  // Get custom images
  app.get("/api/custom-images", async (req, res) => {
    try {
      const images = await storage.getCustomImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch custom images" });
    }
  });

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  });

  // Get preset images
  app.get("/api/preset-images", (req, res) => {
    const presetImages = [
      {
        id: "landscape",
        name: "Mountain Lake",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      },
      {
        id: "cityscape",
        name: "City Skyline",
        url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      },
      {
        id: "ocean",
        name: "Tropical Beach",
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      },
      {
        id: "forest",
        name: "Pine Forest",
        url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        thumbnail: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      }
    ];
    
    res.json(presetImages);
  });

  const httpServer = createServer(app);
  return httpServer;
}
