export interface iDestructionProtocol {
    id: number;
    produktId: number;
    variationId: string;
    produkt_name: string;
    quantity: number;
    quantity_at_once: number;
    type: string;
    destruction_date: Date;
    responsible_person:string;
    status: string;
    description: string | null;
}

export enum Destruction_Protocol_Status {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  ABGEBROCHEN='ABGEBROCHEN'
}
export enum Destruction_Protocol_Type {
  'Beschädigt im Transport' ='Beschädigt im Transport',
  'Gestohlen' ='Gestohlen',
  'Verloren im Transport'='Verloren im Transport'
}
