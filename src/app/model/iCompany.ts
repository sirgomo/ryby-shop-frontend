export interface iCompany {
  id?: number;
  name: string;
  company_name: string;
  address: string;
  city: string;
  postleitzahl: string;
  country: string;
  phone: string;
  email: string;
  isKleinUnternehmen: number;
  ustNr: string;
  fax: string;
  eu_komm_hinweis: string;
  agb: string;
  daten_schutzt: string;
  cookie_info: string;
  ebay_refresh_token?: string;
  is_in_urlop: boolean;
}
