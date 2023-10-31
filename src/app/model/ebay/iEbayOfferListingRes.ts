import { iEbayOffer } from "./iEbayOffer";

export interface iEbayOfferListingRes {
 href : string;
limit : number;
next : string;
offers : iEbayOffer[];
prev : string;
size : number;
total : number;
}
