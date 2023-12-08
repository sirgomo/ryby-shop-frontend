import { iBestellung } from "./iBestellung";
import { iProductBestellung } from "./iProductBestellung";
import { iUserData } from "./iUserData";

export interface iProduktRueckgabe{
  id?: number;
  bestellung: iBestellung;
  produkte: iProductBestellung[];
  kunde: iUserData;
  rueckgabegrund: string;
  rueckgabedatum?: Date;
  rueckgabestatus: string;
  amount: number;
  paypal_refund_id:string;
  paypal_refund_status: string;
  corrective_refund_nr: number;
  is_corrective: number;
}
export enum RUECKGABESTATUS {
  FULL_REFUND = 'FULL_REFUND',
  PARTIAL_REFUND = 'PARTIAL_REFUND'
}
