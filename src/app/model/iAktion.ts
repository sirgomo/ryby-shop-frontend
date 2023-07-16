import { iProduct } from "./iProduct";

export interface iAktion{

  id: number | undefined;
  produkt: iProduct[];
  startdatum: string;
  enddatum: string;
  rabattProzent: number;
}
