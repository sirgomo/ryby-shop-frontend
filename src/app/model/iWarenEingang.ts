import { iLieferant } from "./iLieferant";
import { iWareneingangProduct } from "./iWareneingangProduct";

export interface iWarenEingang {
  id?: number,
  products: iWareneingangProduct[],
  lieferant: iLieferant,
  empfangsdatum: Date,
  rechnung: string,
  lieferscheinNr: string,
  datenEingabe: Date,
  gebucht: boolean,
  eingelagert: boolean,
}
