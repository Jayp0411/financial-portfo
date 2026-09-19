import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health",(req,res)=>res.json({status:"ok",service:"financial-portfolio-api"}));
app.use("/api/auth",authRoutes);
app.use("/api/portfolio",portfolioRoutes);

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({message:"Internal server error."});
});

connectDB().then(()=>{
  app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
}).catch((error)=>{
  console.error("Database connection failed:",error);
  process.exit(1);
});
