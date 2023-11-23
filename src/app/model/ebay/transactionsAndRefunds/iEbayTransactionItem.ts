import { iEbayRefundItem } from "./iEbayRefundItem";
import { iEbayTransaction } from "./iEbayTransaction";

export interface iEbayTransactionItem {
  id?: number;
  title: string;
  sku: string;
  quanity: number;
  price: number;
  transaction: iEbayTransaction;
  refund_item: iEbayRefundItem;
}
