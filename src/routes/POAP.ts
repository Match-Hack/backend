import { gql } from 'graphql-request';
import { init, fetchQuery } from "@airstack/node";
import express, {
  Request,
  Response,
  Router,
  json
} from "express";
import dotenv from 'dotenv';

dotenv.config();
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY ?? "";
init(AIRSTACK_API_KEY);

const router = Router();
router.use(json());

const commonPOAPQuery = gql`
query CommonPOAPs($lens1: Identity!, $lens2: Identity!) {
    user1: Wallet(input: {identity: $lens1, blockchain: ethereum}) {
      poaps(input: {blockchain: ALL}) {
        eventId
      }
    }
    user2: Wallet(input: {identity: $lens2, blockchain: ethereum}) {
      poaps(input: {blockchain: ALL}) {
        eventId
      }
    }
  }
`; // Replace with GraphQL Query

const POAPInfoQuery = gql`query MyQuery($eventIds: [String!]) {
  PoapEvents(input: {filter: {eventId: {_in: $eventIds}}, blockchain: ALL}) {
    PoapEvent {
      eventId
      eventName
      contentValue {
        image {
          extraSmall
        }
      }
    }
  }
}`;


export default async function getPOAPs(lens1: string, lens2: string) {
  const variables = {
    lens1,
    lens2
  };

  const { data, error } = await fetchQuery(commonPOAPQuery, variables);
  console.log(data); 
  if (!data) {
    return null;
  }

  const { user1, user2 } = data;

  // check if user1Poaps or user2Poaps is null or undefined
  if (!user1?.poaps || !user2?.poaps) {
    return null;
  }

  const user1Poaps = user1.poaps;
  const user2Poaps = user2.poaps;

  const user1PoapEventIds = user1Poaps.map((poap: { eventId: string }) => poap.eventId);
  const user2PoapEventIds = user2Poaps.map((poap: { eventId: string }) => poap.eventId);
  const commonPoapEventIds = user1PoapEventIds.filter((eventId: string) => user2PoapEventIds.includes(eventId));
  const poapInfo = await fetchQuery(POAPInfoQuery, { eventIds: commonPoapEventIds });

  if (poapInfo && poapInfo.data && poapInfo.data.PoapEvents && poapInfo.data.PoapEvents.PoapEvent) {
    return poapInfo.data.PoapEvents.PoapEvent;
  } else {
    return null;
  }
}

//export default router;  