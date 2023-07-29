import { iProduct } from "./iProduct";
import { iWarenEingang } from "./iWarenEingang";

export interface iWareneingangProduct {
  id?: number,
  wareneingang: iWarenEingang | null,
  produkt: iProduct,
  menge: number,
  preis: number,
  mwst: number,
  mengeEingelagert: number,
  color: string,
}
