import { iProduct } from "./iProduct";
import { iProduktRueckgabe } from "./iProduktRueckgabe";

export interface iProductBestellung {
  id?: number,
  bestellung: number,
  produkt: iProduct[],
  menge: number,
  color: string,
  rabatt: number,
  mengeGepackt: number,
  productRucgabe: iProduktRueckgabe,
}
