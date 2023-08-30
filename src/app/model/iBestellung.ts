import { iProductBestellung } from "./iProductBestellung";
import { iUserData } from "./iUserData";

export interface iBestellung {
  id?: number,
  kunde: iUserData,
  produkte: iProductBestellung[],
  bestelldatum: Date,
  status: string,
  lieferdatum: Date,
  zahlungsart: string,
  gesamtwert: number,
  zahlungsstatus: string,
  bestellungstatus: BESTELLUNGSSTATUS,

}

export enum BESTELLUNGSSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  VERSCHICKT = 'VERSCHICKT',
}
