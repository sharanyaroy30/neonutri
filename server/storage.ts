import { 
  babies, 
  feedingLogs, 
  growthRecords, 
  milestones, 
  users,
  type Baby, 
  type InsertBaby,
  type FeedingLog, 
  type InsertFeedingLog,
  type GrowthRecord, 
  type InsertGrowthRecord,
  type Milestone, 
  type InsertMilestone,
  type User, 
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Baby methods
  getBaby(id: number): Promise<Baby | undefined>;
  getBabiesByUserId(userId: number): Promise<Baby[]>;
  createBaby(baby: InsertBaby): Promise<Baby>;
  updateBaby(id: number, baby: Partial<InsertBaby>): Promise<Baby | undefined>;
  
  // Feeding log methods
  getFeedingLog(id: number): Promise<FeedingLog | undefined>;
  getFeedingLogsByBabyId(babyId: number): Promise<FeedingLog[]>;
  createFeedingLog(log: InsertFeedingLog): Promise<FeedingLog>;
  deleteFeedingLog(id: number): Promise<boolean>;
  
  // Growth record methods
  getGrowthRecord(id: number): Promise<GrowthRecord | undefined>;
  getGrowthRecordsByBabyId(babyId: number): Promise<GrowthRecord[]>;
  createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord>;
  deleteGrowthRecord(id: number): Promise<boolean>;
  
  // Milestone methods
  getMilestone(id: number): Promise<Milestone | undefined>;
  getMilestonesByBabyId(babyId: number): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: number, milestone: Partial<Milestone>): Promise<Milestone | undefined>;
}

export class MemStorage implements IStorage {
  private usersStore: Map<number, User>;
  private babiesStore: Map<number, Baby>;
  private feedingLogsStore: Map<number, FeedingLog>;
  private growthRecordsStore: Map<number, GrowthRecord>;
  private milestonesStore: Map<number, Milestone>;
  
  private userIdCounter: number;
  private babyIdCounter: number;
  private feedingLogIdCounter: number;
  private growthRecordIdCounter: number;
  private milestoneIdCounter: number;

  constructor() {
    this.usersStore = new Map();
    this.babiesStore = new Map();
    this.feedingLogsStore = new Map();
    this.growthRecordsStore = new Map();
    this.milestonesStore = new Map();
    
    this.userIdCounter = 1;
    this.babyIdCounter = 1;
    this.feedingLogIdCounter = 1;
    this.growthRecordIdCounter = 1;
    this.milestoneIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.usersStore.set(id, user);
    return user;
  }
  
  // Baby methods
  async getBaby(id: number): Promise<Baby | undefined> {
    return this.babiesStore.get(id);
  }
  
  async getBabiesByUserId(userId: number): Promise<Baby[]> {
    return Array.from(this.babiesStore.values()).filter(
      (baby) => baby.userId === userId,
    );
  }
  
  async createBaby(baby: InsertBaby): Promise<Baby> {
    const id = this.babyIdCounter++;
    const newBaby: Baby = { ...baby, id };
    this.babiesStore.set(id, newBaby);
    return newBaby;
  }
  
  async updateBaby(id: number, updates: Partial<InsertBaby>): Promise<Baby | undefined> {
    const baby = await this.getBaby(id);
    if (!baby) return undefined;
    
    const updatedBaby = { ...baby, ...updates };
    this.babiesStore.set(id, updatedBaby);
    return updatedBaby;
  }
  
  // Feeding log methods
  async getFeedingLog(id: number): Promise<FeedingLog | undefined> {
    return this.feedingLogsStore.get(id);
  }
  
  async getFeedingLogsByBabyId(babyId: number): Promise<FeedingLog[]> {
    return Array.from(this.feedingLogsStore.values()).filter(
      (log) => log.babyId === babyId,
    );
  }
  
  async createFeedingLog(log: InsertFeedingLog): Promise<FeedingLog> {
    const id = this.feedingLogIdCounter++;
    const newLog: FeedingLog = { ...log, id };
    this.feedingLogsStore.set(id, newLog);
    return newLog;
  }
  
  async deleteFeedingLog(id: number): Promise<boolean> {
    return this.feedingLogsStore.delete(id);
  }
  
  // Growth record methods
  async getGrowthRecord(id: number): Promise<GrowthRecord | undefined> {
    return this.growthRecordsStore.get(id);
  }
  
  async getGrowthRecordsByBabyId(babyId: number): Promise<GrowthRecord[]> {
    return Array.from(this.growthRecordsStore.values()).filter(
      (record) => record.babyId === babyId,
    );
  }
  
  async createGrowthRecord(record: InsertGrowthRecord): Promise<GrowthRecord> {
    const id = this.growthRecordIdCounter++;
    const newRecord: GrowthRecord = { ...record, id };
    this.growthRecordsStore.set(id, newRecord);
    return newRecord;
  }
  
  async deleteGrowthRecord(id: number): Promise<boolean> {
    return this.growthRecordsStore.delete(id);
  }
  
  // Milestone methods
  async getMilestone(id: number): Promise<Milestone | undefined> {
    return this.milestonesStore.get(id);
  }
  
  async getMilestonesByBabyId(babyId: number): Promise<Milestone[]> {
    return Array.from(this.milestonesStore.values()).filter(
      (milestone) => milestone.babyId === babyId,
    );
  }
  
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const id = this.milestoneIdCounter++;
    const newMilestone: Milestone = { ...milestone, id };
    this.milestonesStore.set(id, newMilestone);
    return newMilestone;
  }
  
  async updateMilestone(id: number, updates: Partial<Milestone>): Promise<Milestone | undefined> {
    const milestone = await this.getMilestone(id);
    if (!milestone) return undefined;
    
    const updatedMilestone = { ...milestone, ...updates };
    this.milestonesStore.set(id, updatedMilestone);
    return updatedMilestone;
  }
}

export const storage = new MemStorage();
