import { iRefunds } from "../../iRefund";
import { iEbayTransactionItem } from "./iEbayTransactionItem";

export interface iEbayTransaction {
  id?: number;
  orderId: string;
  creationDate: Date;
  price_total: number;
  price_shipping: number;
  price_tax: number;
  price_discont: number;
  sel_amount: number;
  ebay_fee: number;
  ebay_advertising_cost: number;
  payment_status: string;
  items: iEbayTransactionItem[];
  refunds: iRefunds[];
  zahlungsart: string;
}
