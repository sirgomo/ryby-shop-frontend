import { isPlatformServer } from "@angular/common";
import { ElementRef } from "@angular/core";
import { HelperService } from "../helper/helper.service";
import { iProduct } from "../model/iProduct";
import { iProduktVariations } from "../model/iProduktVariations";
import { iSordedVariation } from "../model/iSortedVariation";

export function  doWeHaveEnough(item: iProduct, helper: HelperService, current: iProduktVariations) {
  const currentCard = helper.cardSigForMengeControl();
  let currentQanity = 0;
  for (let i = 0; i < currentCard.length; i++) {
    if(currentCard[i].id === item.id) {
      for (let j = 0; j < currentCard[i].variations.length; j++) {
        if(currentCard[i].variations[j].sku === current.sku)
          currentQanity += currentCard[i].variations[j].quanity;
      }
    }
  }

  return (currentQanity + 1) <= current.quanity;
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
