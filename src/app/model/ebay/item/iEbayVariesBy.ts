export interface iEbayVariesBy {
    aspectsImageVariesBy: string[];
    specifications: iEbayVariesSpecification[];
}

export interface iEbayVariesSpecification {
    name: string;
    values: string[];
}