import { iRefundItem } from "./iRefundItem";
import { iEbayTransaction } from "./ebay/transactionsAndRefunds/iEbayTransaction";

export interface iRefunds {
  id?: number;
  orderId: string;
  creationDate: Date;
  reason: string;
  amount: number;
  transaction: iEbayTransaction;
  refund_items: iRefundItem[];
}
