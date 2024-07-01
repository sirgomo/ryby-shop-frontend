export interface iShopMonthDetails {
  bestellungId: number;
  color: string;
  id: number;
  menge: number;
  name: string;
  peuro: string;
  productId: number;
  produkts: iShopMonthDetails[];
  row_count: string;
  shipping: string;
  squantity: number;
  status: string;
  tax: string;
  total: string;
  verkauf_price: string;
  verkauf_rabat: string;
  verkauf_steuer: string;
}
