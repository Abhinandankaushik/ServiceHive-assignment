import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const configureDnsForSrv = (uri: string): void => {
  if (!uri.startsWith("mongodb+srv://")) return;
  const servers =
    process.env.DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean) ??
    ["8.8.8.8", "1.1.1.1"];
  dns.setServers(servers);
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export const connectDB = async (): Promise<void> => {
  if (cached.conn) return;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not defined");
    configureDnsForSrv(uri);
    cached.promise = mongoose.connect(uri).then((conn) => {
      // eslint-disable-next-line no-console
      console.log("✅ MongoDB connected");
      return conn;
    });
  }

  cached.conn = await cached.promise;
};
