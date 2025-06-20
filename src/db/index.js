import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Connecting to:", `${process.env.MONGODB_URI}/${DB_NAME}`);

    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;

// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//   try {
//     const fullUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
//     console.log("🔍 FULL MONGO URI:", fullUri); // 🔥 THIS LINE IS IMPORTANT

//     const connectionInstance = await mongoose.connect(fullUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(
//       `✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
//     );
//   } catch (error) {
//     console.log("❌ MONGODB connection error", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;

