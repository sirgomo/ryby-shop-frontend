import { iProduct } from "./iProduct";

export interface iProduktVariations {
  sku: string
  produkt: Partial<iProduct>;
  variations_name: string;
  hint: string;
  value: string;
  unit: string;
  image: string;
}
