// route to handle the like logic
import express from 'express';
import { Router } from 'express';
import like from '../models/like';
import match from '../models/match';
const router: Router = Router();
router.use(express.json());

router.post("/like", async (req, res) => {
  try {
    const { from, to } = req.body;
    const doc = new like({ from, to });
    const newDoc = await doc.save();

    // Check for a match
    const isMatch = await checkMatch(from, to);

    if (isMatch) {
        const matchdoc = new match({ lens1 : from, lens2 :to });
        await matchdoc.save();
      res.status(201).json({ newDoc, message: "It's a match!" });

    } else {
      res.status(201).json({ newDoc, message: "Like successful" });
    }
  } catch (error) {
    console.log("error in the post request like");
    res.status(500).json({ message: error });
  }
});

router.post("/match", async (req, res) => {
  try {
    const  lensHandle  = req.body.lensHandle;
    console.log(lensHandle); 

    // Find all matches where lens1 or lens2 matches the user's lens handle
    const matches = await match.find({
      $or: [
        { lens1: lensHandle },
        { lens2: lensHandle}
      ]
    });

    // Extract the lens handles from the matches
    const lensHandles = matches.map((match) => {
      if (match.lens1 === lensHandle) {
        return match.lens2;
      } else {
        return match.lens1;
      }
    });

    res.status(200).json({ lensHandles });
  } catch (error) {
    console.log("Error in the POST request to retrieve lens handles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/unlike", async (req, res) => {
  try {
    const { from, to } = req.body;
    const deletedDoc = await like.findOneAndDelete({ from, to });

    if (!deletedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error });
  }
});

// function to check if there is a match between 2 users
const checkMatch = async (from: string, to: string) => {
  try {
    const match1 = await like.findOne({ from, to });
    const match2 = await like.findOne({ from: to, to: from });

    if (match1 && match2) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

export default router;