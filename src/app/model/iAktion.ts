import { iProduct } from "./iProduct";

export interface iAktion{
  id?: number;
  aktion_key: string;
  produkt: iProduct[];
  startdatum: string;
  enddatum: string;
  rabattProzent: number;
}
