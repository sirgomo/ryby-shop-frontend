import { iEbayInventoryItem } from "./iEbayInventoryItem";

export interface iEbayInventory {
  href : string;
  inventoryItems : iEbayInventoryItem[];
  limit : number;
  next?: string;
  prev?: string;
  size : number;
  total : number;
}
