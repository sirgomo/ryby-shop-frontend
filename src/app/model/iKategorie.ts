import { iProduct } from "./iProduct";

export interface iKategorie {
  id: number,
  parent_id: number | null,
  name: string,
  products: iProduct[],
}
