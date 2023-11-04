import { isPlatformServer } from "@angular/common";
import { ElementRef } from "@angular/core";
import { HelperService } from "../helper/helper.service";
import { iProduct } from "../model/iProduct";
import { iProduktVariations } from "../model/iProduktVariations";
import { iSordedVariation } from "../model/iSortedVariation";

export function  doWeHaveEnough(helper: HelperService, current: iProduktVariations, quanity: number) {
  const currentCard = helper.cardSig();
  const orginalQuani = helper.cardSigForMengeControl();
  let currentQanity = 0;
  let orginalQuanity = 0;
  let  found = false;
  for (let i = 0; i < currentCard.length; i++) {
      for (let j = 0; j < currentCard[i].variations.length; j++) {
        if(currentCard[i].variations[j].sku === current.sku)
          currentQanity += currentCard[i].variations[j].quanity;
      }
  }
  for (let i = 0; i < orginalQuani.length; i++) {
    for (let j = 0; j < orginalQuani[i].variations.length; j++) {
      if(orginalQuani[i].variations[j].sku === current.sku && !found) {
        orginalQuanity += orginalQuani[i].variations[j].quanity;
        found = true;
      }
    }
  }
  if(orginalQuani.length === 0)
  return current.quanity >= quanity;

  return found ? (currentQanity + quanity) <= orginalQuanity : true ;
}
export function getSortedVariation (item: iProduct) {
  const variations : iSordedVariation[] = [];

  for (let i = 0; i< item.variations.length; i++) {

      const index = variations.findIndex((tmp) => tmp.name === item.variations[i].variations_name);
      if(index === -1) {
        variations.push({name: item.variations[i].variations_name, item: [item.variations[i]]});
      } else {
        variations[index].item.push(item.variations[i]);
      }

  }
  return variations;
}
export function setSelectedVaration(ele: ElementRef, platform: any) {
  if(isPlatformServer(platform))
  return;

   if(!ele)
    return;


  const selects = ele.nativeElement.value;
  console.log(selects);
}
