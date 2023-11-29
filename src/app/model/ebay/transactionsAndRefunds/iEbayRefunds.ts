import { CurrencyCodeEnum, iEbayRefundItem } from "./iEbayRefundItem"

export interface iEbayRefunds {
    "reasonForRefund": ReasonForRefundEnum,
    "comment": string,
    "refundItems": iEbayRefundItem[],
    "orderLevelRefundAmount": {
      "currency": CurrencyCodeEnum,
      "value": string
    }
}
export enum ReasonForRefundEnum {
    BUYER_CANCEL,
    SELLER_CANCEL,
    ITEM_NOT_RECEIVED,
    BUYER_RETURN,
    ITEM_NOT_AS_DESCRIBED,
    OTHER_ADJUSTMENT,
    SHIPPING_DISCOUNT
}
