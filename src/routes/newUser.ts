import express, {
    Request,
    Response,
    json
} from "express";
import {
    Router
} from "express";

import user from "../models/user";

import mongoose from "mongoose";
const router: Router = Router();
router.use(json());

router.post("/newUser", async (req: Request, res: Response) => {
    try {
        const existingUser = await user.findOne({
          lensProfile: req.body.lensProfile,
          hackathon: req.body.hackathon
        });
    
        if (existingUser) {
          return res.status(400).json({ message: "User with matching lens and hackathon already exists" });
        }
    
        const doc = new user({
          lensProfile: req.body.lensProfile,
          hackathon: req.body.hackathon,
          github: req.body.github,
          twitter: req.body.twitter,
          telegram: req.body.telegram,
          skills: req.body.skills,
          bio: req.body.bio
        });
    
        const newDoc = await doc.save();
        res.status(201).json(newDoc);
      } catch (error) {
        console.log("error in the post request newUser");
        res.status(500).json({ message: error });
      }
});

router.post("/deleteUser",async(req:Request, res:Response)=>{
    try{
        const { lensProfile } = req.body.lensProfile;
        const deletedDoc = await user.findOneAndDelete({ lensProfile: new mongoose.Types.ObjectId(lensProfile) });
        if (!deletedDoc) {
            return res.status(404).json({
                message: "Document not found"
            });
        }
        res.status(200).json({
            message: "Document deleted successfully"
        }); 
    }catch(error){
        console.log(error); 
        res.status(500).json({
            error_message : error
        })
    }
})



export default router;