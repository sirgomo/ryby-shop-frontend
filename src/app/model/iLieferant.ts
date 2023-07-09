export interface iLieferant {
  id: number | undefined;
  name: string;
  email: string;
  telefon: string;
  adresse: {
    strasse: string;
    hausnummer: string;
    stadt: string;
    postleitzahl: string;
    land: string;
  }
  steuernummer: string;
  bankkontonummer: string;
  ansprechpartner: string;
  zahlart: string;
  umsatzsteuerIdentifikationsnummer: string;
}
