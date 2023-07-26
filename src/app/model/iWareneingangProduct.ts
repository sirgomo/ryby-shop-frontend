import { iProduct } from "./iProduct";

export interface iWareneingangProduct {
  id?: number,
  wareneingang: iWareneingangProduct,
  produkt: iProduct,
  menge: number,
  preis: number,
  mwst: number,
  mengeEingelagert: number,
}
