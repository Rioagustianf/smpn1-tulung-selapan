import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/smp-tulung-selapan";

async function seedSettings() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("smp-tulung-selapan");
    const settingsCollection = db.collection("settings");

    // Check if settings already exist
    const existingSettings = await settingsCollection.findOne({});

    if (existingSettings) {
      console.log("Settings already exist, skipping seed");
      return;
    }

    // Default settings
    const defaultSettings = {
      schoolName: "SMP Negeri 1 Tulung Selapan",
      address:
        "Jl. Merdeka Tulung Selapan, Kec., Tulung Selapan, Kab. Ogan Komering Ilir, Prov., Sumatera Selatan",
      phone: "083175234544",
      email: "smpn1tulungselapan@yahoo.com",
      vision:
        "Membentuk pembelajar yang akhlakul kariman, berilmu, beretika, berwawasan lingkungan untuk menuju pentas dunia.",
      mission:
        "Mewujudkan pendidikan dengan keteladanan\nMengembangkan budaya belajar dengan didasari pada kecintaan terhadap ilmu pengetahuan\nMeningkatkan fasilitas sekolah menuju sekolah bersih, sehat dan berwawasan lingkungan",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await settingsCollection.insertOne(defaultSettings);
    console.log("Settings seeded successfully:", result.insertedId);
  } catch (error) {
    console.error("Error seeding settings:", error);
  } finally {
    await client.close();
  }
}

seedSettings();
