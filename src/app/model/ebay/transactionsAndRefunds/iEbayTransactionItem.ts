import { iRefundItem } from "../../iRefundItem";
import { iEbayTransaction } from "./iEbayTransaction";

export interface iEbayTransactionItem {
  id?: number;
  title: string;
  sku: string;
  quanity: number;
  price: number;
  transaction: iEbayTransaction;
  refund_item: iRefundItem;
}
