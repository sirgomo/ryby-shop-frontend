import { iProduct } from "./iProduct";

export interface iEan {
  id?: number;
  eanCode: string;
  product?: iProduct;
}
