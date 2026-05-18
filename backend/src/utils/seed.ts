import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Lead } from "../models/Lead";
import mongoose from "mongoose";
import { LeadSource, LeadStatus } from "../types";

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

const run = async (): Promise<void> => {
  await connectDB();
  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({
    name: "Admin",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
  });
  const sales = await User.create({
    name: "Sales User",
    email: "sales@demo.com",
    password: "sales123",
    role: "sales",
  });

  const leads = Array.from({ length: 35 }).map((_, i) => ({
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@example.com`,
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    owner: i % 2 === 0 ? admin._id : sales._id,
  }));
  await Lead.insertMany(leads);

  // eslint-disable-next-line no-console
  console.log("Seeded: admin@demo.com / admin123  and  sales@demo.com / sales123");
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
