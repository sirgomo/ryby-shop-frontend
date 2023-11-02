import { iStellplatz } from "./iStellplatz";

export interface iLager {
  id?: number;
  name: string;
  lagerorte: iStellplatz[];
  adresse: string;
}
