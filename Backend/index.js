import express from "express";
import "dotenv/config";
import cors from "cors";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import chatRoutes from "./routes/chart.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api", chatRoutes);

//Groq client (replaces OpenAI REST call)
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

//Health check Route!
app.get("/", (req, res) => {
  res.send("SigmaGPT Backend is running!");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with Database!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect with DB", err);
    process.exit(1);
  }
};

startServer();

// app.post("/test", async (req, res) => {
//   try {
//     const completion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant", // Free Groq model
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     });

//     //Same output as tutor
//     res.send(completion.choices[0].message.content);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Something went wrong");
//   }
// });
