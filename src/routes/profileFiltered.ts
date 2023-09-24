import { gql } from 'graphql-request';
import { Client, cacheExchange, fetchExchange } from '@urql/core';


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
const LENS_API_URL = 'https://api.lens.dev';
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY ?? "";
init(AIRSTACK_API_KEY);

const urqlClient= new Client(
    {
    url: LENS_API_URL,
    exchanges: [cacheExchange, fetchExchange],
  }
  )

  const pingQuery = gql`query Profiles($lensArray : [Handle!]) {
    profiles(request: { handles: $lensArray, limit: 5 }) {
      items {
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }`;
// function to find all the lens profile that are in the same hackathon

async function findLensProfileInSameHackathon(hackathonName: string, lenshandle: string) {
    try {
        console.log("lenshandle : ", lenshandle);
      const users = await user.find({ hackathon: hackathonName, lensProfile: { $ne: lenshandle } });
      console.log(users); 
      const profiles = users.map((user: { lensProfile: string }) => user.lensProfile);
      return profiles;
    } catch (error) {
      console.log(error);
    }
  }

  router.post("/profileFiltered", async (req: Request, res: Response) => {
    try {
      const hackathonName = req.body.hackathonName;
      const lenshandle = req.body.lens;
      const lensProfiles = await findLensProfileInSameHackathon(hackathonName, lenshandle);
      const response = await urqlClient.query(pingQuery, {
        lensArray: lensProfiles
      }).toPromise();
      const items = response.data.profiles.items;
      console.log("items : ", items); 
      res.status(200).json(items);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: error
      });
    }
  });
export default router;