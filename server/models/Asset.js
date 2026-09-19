import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  user: { type:mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  name: { type:String, required:true, trim:true, maxlength:100 },
  ticker: { type:String, required:true, trim:true, uppercase:true, maxlength:20 },
  category: { type:String, enum:["Stock","Crypto","Cash","Real Estate"], required:true },
  sharesOwned: { type:Number, required:true, min:0 },
  avgBuyPrice: { type:Number, required:true, min:0 },
  currentPrice: { type:Number, required:true, min:0 }
}, { timestamps:true });

assetSchema.index({ user:1, ticker:1 }, { unique:true });
export default mongoose.model("Asset", assetSchema);
