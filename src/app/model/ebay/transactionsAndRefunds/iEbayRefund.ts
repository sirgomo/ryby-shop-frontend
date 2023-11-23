import { iEbayRefundItem } from "./iEbayRefundItem";
import { iEbayTransaction } from "./iEbayTransaction";

export interface iEbayRefunds {
  id?: number;
  orderId: string;
  creationDate: boolean;
  reason: string;
  amount: number;
  transaction: iEbayTransaction;
  refund_items: iEbayRefundItem[];
}
