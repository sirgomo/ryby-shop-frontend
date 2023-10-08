import { iEbayTopic } from "./iEbayTopic";

export interface iEbayTopicsPayload {
  total : number;
  href : string;
  next : string;
  limit : number;
  topics: iEbayTopic[];
}
