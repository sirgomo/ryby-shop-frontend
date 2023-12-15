import { iRefunds } from "./iRefund";


export interface iRefundItem {
  id?: number;
  refund_item: iRefunds;
  amount: number;
  sku:string;
  item_quanity:number;
}
