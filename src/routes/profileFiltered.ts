import { gql } from 'graphql-request';
import { init, fetchQuery } from "@airstack/node";
import express, {
    Request,
    Response,
    Router,
    json
} from "express";
import user from '../models/user';
const router = Router();
router.use(json());

import dotenv from 'dotenv';
dotenv.config();
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY ?? "";
init(AIRSTACK_API_KEY);

const query = gql`query MyQuery($profileNames: [String!]) {
    Socials(input: {filter: {profileName: {_in: $profileNames}, dappName: {_eq: lens}}, blockchain: ethereum}) {
      Social {
        profileName
        profileBio
        profileDisplayName
        profileImage
        profileUrl
        dappName
        userAddress
        profileTokenAddress
        profileTokenId
      }
    }
  }
`;
// function to find all the lens profile that are in the same hackathon

async function findLensProfileInSameHackathon(hackathonName: string) {
    try {
        const users = await user.find({ hackathon: hackathonName });
        const lensProfiles = users.map((user: { lensProfile: string }) => user.lensProfile);
        return lensProfiles;
    } catch (error) {
        console.log(error);
    }
}

router.post("/profileFiltered", async (req: Request, res: Response) => {   
    try {
        const hackathonName = req.body.hackathonName;
        const lensProfiles = await findLensProfileInSameHackathon(hackathonName);
        console.log(lensProfiles);
        const variables = {
            profileNames: lensProfiles
        }
        const { data, error } = await fetchQuery(query, variables);
        const { Socials } = data;
        const Social = Socials.Social;
        res.status(200).json({
            Social: Social
        })
    }
    catch (error) {
        console.log(error);
    }

});
export default router;