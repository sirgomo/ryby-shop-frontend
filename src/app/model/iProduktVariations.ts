import { iProduct } from "./iProduct";

export interface iProduktVariations {
  sku: string
  produkt: Partial<iProduct>;
  variations_name: string;
  hint: string;
  value: string;
  unit: string;
  image: string;
  price: number;
  wholesale_price: number;
  thumbnail: string;
  quanity: number;
  quanity_sold: number;
  quanity_sold_at_once: number;
}
