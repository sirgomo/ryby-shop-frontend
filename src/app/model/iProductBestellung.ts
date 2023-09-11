import { iProduct } from "./iProduct";
import { iProduktRueckgabe } from "./iProduktRueckgabe";

export interface iProductBestellung {
  id?: number,
  bestellung: number,
  produkt: iProduct[],
  menge: number,
  color: string,
  color_gepackt: string;
  rabatt: number,
  mengeGepackt: number,
  verkauf_price: number,
  verkauf_rabat: number,
  verkauf_steuer: number,
  productRucgabe: iProduktRueckgabe,
}
