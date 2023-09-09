import { iAktion } from "./iAktion";
import { iEan } from "./iEan";
import { iKategorie } from "./iKategorie";
import { iKundenbewertung } from "./iKundenbewertung";
import { iLieferant } from "./iLieferant";
import { iProductBestellung } from "./iProductBestellung";
import { iStellplatze } from "./iStellplatze";
import { iWarenausgangProduct } from "./iWarenausgangProduct";
import { iWareneingangProduct } from "./iWareneingangProduct";

export interface iProduct {
  id: number | undefined;
  name: string;
  preis: number;
  artid: number;
  beschreibung: string;
  color: string;
  foto: string;
  thumbnail: string;
  lieferant: iLieferant;
  lagerorte: iStellplatze[];
  bestellungen: iProductBestellung[];
  datumHinzugefuegt: string;
  kategorie: iKategorie[];
  verfgbarkeit: number;
  mindestmenge: number;
  currentmenge: number;
  product_sup_id: string;
  lange: number;
  gewicht: number;
  verkaufteAnzahl: number;
  wareneingang: iWareneingangProduct[];
  mehrwehrsteuer: number;
  promocje: iAktion[];
  bewertung: iKundenbewertung[];
  eans: iEan[];
}
