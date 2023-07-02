import { iProdukt } from "./iProdukt";

export interface iKategorie {
  id: number,
  parent_id: number | null,
  name: string,
  products: iProdukt[],
}
