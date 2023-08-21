import { iProductBestellung } from "./iProductBestellung";
import { iReservierung } from "./iReservierung";
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
  reservation: iReservierung,
}
