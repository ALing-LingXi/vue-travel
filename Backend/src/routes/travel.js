import express from "express";
import travelService from "../services/traelService.js";
import createStreamResponse from "../utils/createStreamResponse.js";
const router = express.Router();

router.post("/recommend", async (req, res) => {
 const {city,budget,days} = req.body;
 if(!city||!budget||!days){
  return res.status(404).json({success:false,message:"缺少city,budget,days参数"})
 }
 try{
  const result = await travelService.recommend(city,budget,days);
  res.json({success:true,result});
 }catch(err){
  res.status(500).json({success:false,message:err.message});
 }
});

router.post("/chat", async (req, res) => {
  if(!req.body.message){
    return res.status(404).json({success:false,message:"缺少message参数"})
  }
  const streamResponse = createStreamResponse(res);
  try{
    const result = await travelService.chat(req.body.message);
    streamResponse.send(result);
  }catch(err){
    streamResponse.error(err);
  }
  streamResponse.end();

});

export default router;