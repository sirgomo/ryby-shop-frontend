export interface iUserData {
  id: number | null;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  registrierungsdatum?: string;
  treuepunkte: number;

  adresse: {
    strasse: string;
    hausnummer: string;
    stadt: string;
    postleitzahl: string;
    land: string;
  }
  lieferadresse?: {
    l_strasse?: string;
    l_hausnummer?: string;
    l_stadt?: string;
    l_postleitzahl?: string;
    l_land?: string;
  }

}
