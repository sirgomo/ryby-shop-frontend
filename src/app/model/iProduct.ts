import { iAktion } from "./iAktion";
import { iEan } from "./iEan";
import { iKategorie } from "./iKategorie";
import { iKundenbewertung } from "./iKundenbewertung";
import { iLieferant } from "./iLieferant";
import { iProductBestellung } from "./iProductBestellung";
import { iProduktVariations } from "./iProduktVariations";
import { iStellplatze } from "./iStellplatze";
import { iWareneingangProduct } from "./iWareneingangProduct";

export interface iProduct {
  id: number | undefined;
  name: string;
  sku: string;
  artid: number;
  beschreibung: string;
  lieferant: iLieferant;
  lagerorte: iStellplatze[];
  bestellungen: iProductBestellung[];
  datumHinzugefuegt: string;
  kategorie: iKategorie[];
  verfgbarkeit: number;
  product_sup_id: string;
  ebay: number;
  wareneingang: iWareneingangProduct[];
  mehrwehrsteuer: number;
  promocje: iAktion[];
  bewertung: iKundenbewertung[];
  eans: iEan[];
  variations: iProduktVariations[];
}
