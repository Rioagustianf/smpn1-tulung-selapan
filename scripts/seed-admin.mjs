import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {});
  const db = client.db("smp-tulung-selapan");
  const username = "admin";
  const password = "admin123";
  const hashed = await bcrypt.hash(password, 10);
  const existing = await db.collection("admins").findOne({ username });
  if (!existing) {
    await db.collection("admins").insertOne({ username, password: hashed });
    console.log("Admin user created!");
  } else {
    console.log("Admin user already exists.");
  }
  process.exit(0);
}

seedAdmin();
