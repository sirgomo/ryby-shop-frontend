import { iProductBestellung } from "./iProductBestellung";
import { iProduktRueckgabe } from "./iProduktRueckgabe";
import { iUserData } from "./iUserData";

export interface iBestellung {
  id?: number,
  kunde: iUserData,
  produkte: iProductBestellung[],
  bestelldatum: Date,
  status: string,
  versand_datum: Date,
  zahlungsart: string,
  gesamtwert: number,
  zahlungsstatus: string,
  shipping_address_json: string,
  bestellungstatus: BESTELLUNGSSTATUS,
  versandart: string;
  versandprice: number;
  varsandnr: string;
  paypal_order_id: string;
  refunds: iProduktRueckgabe[];
}

export enum BESTELLUNGSSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  VERSCHICKT = 'VERSCHICKT',
  EBAY_ORDERS = 'EBAY_ORDERS',
}
export enum BESTELLUNGSSTATE {
  ABGEBROCHEN = 'ABGEBROCHEN',
  BEZAHLT = 'BEZAHLT',
  COMPLETE = 'COMPLETE',
  ARCHIVED = 'ARCHIVED',
}
