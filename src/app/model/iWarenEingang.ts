import { iLieferant } from "./iLieferant";
import { iWareneingangProduct } from "./iWareneingangProduct";

export interface iWarenEingang {
  id?: number,
  products: iWareneingangProduct[],
  lieferant: iLieferant,
  empfangsdatum: string,
  rechnung: string,
  lieferscheinNr: string,
  //buchung date
  datenEingabe: string,
  gebucht: boolean,
  eingelagert: boolean,
}
