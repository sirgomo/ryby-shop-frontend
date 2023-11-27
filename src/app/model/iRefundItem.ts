import { iRefunds } from "./iRefund";
import { iEbayTransactionItem } from "./ebay/transactionsAndRefunds/iEbayTransactionItem";

export interface iRefundItem {
  id?: number;
  refund_item: iRefunds;
  amount: number;
  item: iEbayTransactionItem;
}
