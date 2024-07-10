export interface iEbayGroupItem {
  aspects: string;
  description: string;
  imageUrls: string[];
  inventoryItemGroupKey: string;
  subtitle: string;
  title: string;
  variantSKUs: string[];
  variesBy: {
    aspectsImageVariesBy: string[];
    specifications: {
      name: string;
      values: string[];
    }[];
  };
  videoIds: string[];
}
