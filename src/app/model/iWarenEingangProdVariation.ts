import { iWareneingangProduct } from "./iWareneingangProduct";

export interface iWarenEingangProdVariation {
  id?: number;
  sku: string;
  quanity: number;
  price: number;
  price_in_euro: number;
  wholesale_price: number;
  mwst: number;
  quanity_stored: number;
  waren_eingang_product: iWareneingangProduct;
}
