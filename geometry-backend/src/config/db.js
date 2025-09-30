const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("process.env.MONGO_URI: ", process.env.MONGO_URI);
    await mongoose.connect("mongodb+srv://phuongla342_db:bcdopttll@cluster0.vtc7zgr.mongodb.net/doan_db?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;