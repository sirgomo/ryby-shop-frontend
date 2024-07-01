export interface iEbayMonthDetails{
    discon: string;
    ebay_fee: string;
    id: number;
    itemId: number;
    peuro: string;
    price: string;
    products: iEbayMonthDetails[];
    quantity: number;
    quantity_at_once: number;
    row_count: string;
    shipping: string;
    sku: string;
    tax: string;
    title: string;
    total: string;
}