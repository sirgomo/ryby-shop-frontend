import { iEbaySubscription } from "./iEbaySubscription";

export interface iEbaySubscriptionsPayload {
  total : number;
  href : string;
  next : string;
  limit : number;
  subscriptions : iEbaySubscription[];
}
