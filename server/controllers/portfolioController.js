import mongoose from "mongoose";
import Asset from "../models/Asset.js";

const categories = ["Stock","Crypto","Cash","Real Estate"];

function validate(body) {
  const {name,ticker,category,sharesOwned,avgBuyPrice,currentPrice} = body;
  if (!name || !ticker || !categories.includes(category) ||
      !Number.isFinite(Number(sharesOwned)) ||
      !Number.isFinite(Number(avgBuyPrice)) ||
      !Number.isFinite(Number(currentPrice))) return "Please provide valid asset details.";
  if (Number(sharesOwned)<=0 || Number(avgBuyPrice)<0 || Number(currentPrice)<0) return "Asset values must be valid positive numbers.";
  return null;
}

export async function upsertAsset(req,res) {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({message:error});

    const {name,ticker,category,sharesOwned,avgBuyPrice,currentPrice} = req.body;
    const normalizedTicker = ticker.trim().toUpperCase();

    const asset = await Asset.findOneAndUpdate(
      {user:req.user.id,ticker:normalizedTicker},
      {user:req.user.id,name:name.trim(),ticker:normalizedTicker,category,
       sharesOwned:Number(sharesOwned),avgBuyPrice:Number(avgBuyPrice),currentPrice:Number(currentPrice)},
      {new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true}
    );

    res.json({message:"Asset saved successfully.",asset});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Unable to save asset."});
  }
}

export async function getPortfolioSummary(req,res) {
  try {
    const assets = await Asset.find({user:req.user.id}).sort({createdAt:-1}).lean();

    const totals = await Asset.aggregate([
      {$match:{user:new mongoose.Types.ObjectId(req.user.id)}},
      {$group:{
        _id:null,
        totalValue:{$sum:{$multiply:["$sharesOwned","$currentPrice"]}},
        totalInvested:{$sum:{$multiply:["$sharesOwned","$avgBuyPrice"]}}
      }}
    ]);

    const totalValue = totals[0]?.totalValue || 0;
    const totalInvested = totals[0]?.totalInvested || 0;

    res.json({totalValue,totalInvested,profitLoss:totalValue-totalInvested,assets});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Unable to load portfolio."});
  }
}

export async function deleteAsset(req,res) {
  try {
    const asset = await Asset.findOneAndDelete({_id:req.params.id,user:req.user.id});
    if (!asset) return res.status(404).json({message:"Asset not found."});
    res.json({message:"Asset deleted successfully."});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Unable to delete asset."});
  }
}
