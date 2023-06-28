export interface iUserData {
  id: number | null;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  role: string;
  registrierungsdatum?: Date;
  treuepunkte: number;
  l_strasse?: string;
  l_hausnummer?: string;
  l_stadt?: string;
  l_postleitzahl?: string;
  l_land?: string;
  adresseStrasse: string;
  adresseHausnummer: string;
  adresseStadt: string;
  adressePostleitzahl: string;
  adresseLand: string;
}
