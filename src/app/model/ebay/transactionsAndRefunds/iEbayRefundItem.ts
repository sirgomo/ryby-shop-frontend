import { iEbayRefunds } from "./iEbayRefund";
import { iEbayTransactionItem } from "./iEbayTransactionItem";

export interface iEbayRefundItem {
  id?: number;
  refund_item: iEbayRefunds;
  amount: number;
  item: iEbayTransactionItem;
}
