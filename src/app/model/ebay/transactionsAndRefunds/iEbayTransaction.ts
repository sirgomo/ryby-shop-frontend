import { iEbayRefunds } from "./iEbayRefund";
import { iEbayTransactionItem } from "./iEbayTransactionItem";

export interface iEbayTransaction {
  id?: number;
  orderId: string;
  creationDate: Date;
  payment_status: string;
  items: iEbayTransactionItem[];
  refunds: iEbayRefunds[];
}
