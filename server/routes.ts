import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertBabySchema,
  insertFeedingLogSchema,
  insertGrowthRecordSchema,
  insertMilestoneSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route('/api');

  // Baby routes
  app.get('/api/babies', async (req: Request, res: Response) => {
    // For simplicity assuming userId 1 since we don't have auth
    const userId = 1;
    const babies = await storage.getBabiesByUserId(userId);
    res.json(babies);
  });

  app.get('/api/babies/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const baby = await storage.getBaby(id);
    
    if (!baby) {
      return res.status(404).json({ message: 'Baby not found' });
    }
    
    res.json(baby);
  });

  app.post('/api/babies', async (req: Request, res: Response) => {
    try {
      // For simplicity assuming userId 1 since we don't have auth
      const userId = 1;
      const babyData = { ...req.body, userId };
      const validatedData = insertBabySchema.parse(babyData);
      const baby = await storage.createBaby(validatedData);
      
      // Create default milestones for the baby
      const defaultMilestones = [
        { 
          name: 'First Solids', 
          ageRange: '4-6 months', 
          description: 'Introduction of first solid foods like rice cereal or simple vegetable purees.',
          completed: false,
          completedDate: null,
          babyId: baby.id
        },
        { 
          name: 'Sitting Independently', 
          ageRange: '5-7 months', 
          description: 'Baby can sit in high chair for meals without support, improving feeding posture.',
          completed: false,
          completedDate: null,
          babyId: baby.id
        },
        { 
          name: 'Pincer Grasp', 
          ageRange: '8-10 months', 
          description: 'Development of fine motor skills allowing baby to pick up small pieces of food.',
          completed: false,
          completedDate: null,
          babyId: baby.id
        },
        { 
          name: 'Self-Feeding', 
          ageRange: '9-12 months', 
          description: 'Baby begins to use spoon or fork with assistance to feed themselves.',
          completed: false,
          completedDate: null,
          babyId: baby.id
        },
        { 
          name: 'Drinking from Cup', 
          ageRange: '12-15 months', 
          description: 'Transition from bottle to sippy cup or regular cup with assistance.',
          completed: false,
          completedDate: null,
          babyId: baby.id
        }
      ];
      
      for (const milestone of defaultMilestones) {
        await storage.createMilestone(milestone);
      }
      
      res.status(201).json(baby);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: 'An error occurred while creating the baby profile' });
    }
  });

  app.patch('/api/babies/:id', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const baby = await storage.getBaby(id);
      
      if (!baby) {
        return res.status(404).json({ message: 'Baby not found' });
      }
      
      const updatedBaby = await storage.updateBaby(id, req.body);
      res.json(updatedBaby);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the baby profile' });
    }
  });

  // Feeding log routes
  app.get('/api/babies/:babyId/feeding-logs', async (req: Request, res: Response) => {
    const babyId = Number(req.params.babyId);
    const baby = await storage.getBaby(babyId);
    
    if (!baby) {
      return res.status(404).json({ message: 'Baby not found' });
    }
    
    const logs = await storage.getFeedingLogsByBabyId(babyId);
    res.json(logs);
  });

  app.post('/api/babies/:babyId/feeding-logs', async (req: Request, res: Response) => {
    try {
      const babyId = Number(req.params.babyId);
      const baby = await storage.getBaby(babyId);
      
      if (!baby) {
        return res.status(404).json({ message: 'Baby not found' });
      }
      
      const logData = { ...req.body, babyId };
      const validatedData = insertFeedingLogSchema.parse(logData);
      const log = await storage.createFeedingLog(validatedData);
      
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: 'An error occurred while creating the feeding log' });
    }
  });

  app.delete('/api/feeding-logs/:id', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteFeedingLog(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Feeding log not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the feeding log' });
    }
  });

  // Growth record routes
  app.get('/api/babies/:babyId/growth-records', async (req: Request, res: Response) => {
    const babyId = Number(req.params.babyId);
    const baby = await storage.getBaby(babyId);
    
    if (!baby) {
      return res.status(404).json({ message: 'Baby not found' });
    }
    
    const records = await storage.getGrowthRecordsByBabyId(babyId);
    res.json(records);
  });

  app.post('/api/babies/:babyId/growth-records', async (req: Request, res: Response) => {
    try {
      const babyId = Number(req.params.babyId);
      const baby = await storage.getBaby(babyId);
      
      if (!baby) {
        return res.status(404).json({ message: 'Baby not found' });
      }
      
      const recordData = { ...req.body, babyId };
      const validatedData = insertGrowthRecordSchema.parse(recordData);
      const record = await storage.createGrowthRecord(validatedData);
      
      // Update baby's current measurements
      await storage.updateBaby(babyId, {
        weight: record.weight,
        height: record.height
      });
      
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: 'An error occurred while creating the growth record' });
    }
  });

  app.delete('/api/growth-records/:id', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteGrowthRecord(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Growth record not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the growth record' });
    }
  });

  // Milestone routes
  app.get('/api/babies/:babyId/milestones', async (req: Request, res: Response) => {
    const babyId = Number(req.params.babyId);
    const baby = await storage.getBaby(babyId);
    
    if (!baby) {
      return res.status(404).json({ message: 'Baby not found' });
    }
    
    const milestones = await storage.getMilestonesByBabyId(babyId);
    res.json(milestones);
  });

  app.patch('/api/milestones/:id', async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const milestone = await storage.getMilestone(id);
      
      if (!milestone) {
        return res.status(404).json({ message: 'Milestone not found' });
      }
      
      const updatedMilestone = await storage.updateMilestone(id, req.body);
      res.json(updatedMilestone);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the milestone' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
