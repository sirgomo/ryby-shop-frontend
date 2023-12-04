import { iProductBestellung } from "./iProductBestellung";
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
  bestellungstatus: BESTELLUNGSSTATUS,
  versandart: string;
  versandprice: number;
  varsandnr: string;
  paypal_order_id: string;
}

export enum BESTELLUNGSSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  VERSCHICKT = 'VERSCHICKT',
}
export enum BESTELLUNGSSTATE {
  ABGEBROCHEN = 'ABGEBROCHEN',
  BEZAHLT = 'BEZAHLT',
  COMPLETE = 'COMPLETE',
  ARCHIVED = 'ARCHIVED',
}
