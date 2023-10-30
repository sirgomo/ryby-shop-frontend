import { iProduct } from "./iProduct";
import { iWarenEingang } from "./iWarenEingang";
import { iWarenEingangProdVariation } from "./iWarenEingangProdVariation";

export interface iWareneingangProduct {
  id?: number,
  wareneingang: iWarenEingang | null,
  produkt: iProduct[],
  product_variation: iWarenEingangProdVariation[];
}
