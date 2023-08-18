import { iShippingAddress } from "./iShippingAddress";

export interface iUserData {
  id: number | null;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  registrierungsdatum?: string;
  treuepunkte?: number | undefined;
  adresse: {
    strasse: string;
    hausnummer: string;
    stadt: string;
    postleitzahl: string;
    land: string;
  }
  lieferadresse?: iShippingAddress

}
