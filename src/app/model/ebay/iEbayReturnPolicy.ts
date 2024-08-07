export interface iEbayReturnPolicy{
        "categoryTypes": [
          {
            "default": "boolean",
            "name": "CategoryTypeEnum : [MOTORS_VEHICLES,ALL_EXCLUDING_MOTORS_VEHICLES]"
          }
        ],
        "description": "string",
        "extendedHolidayReturnsOffered": "boolean",
        "internationalOverride": {
          "returnMethod": "ReturnMethodEnum : [EXCHANGE,REPLACEMENT]",
          "returnPeriod": {
            "unit": "TimeDurationUnitEnum : [YEAR,MONTH,DAY,HOUR,CALENDAR_DAY,BUSINESS_DAY,MINUTE,SECOND,MILLISECOND]",
            "value": "integer"
          },
          "returnsAccepted": "boolean",
          "returnShippingCostPayer": "ReturnShippingCostPayerEnum : [BUYER,SELLER]"
        },
        "marketplaceId": "MarketplaceIdEnum : [EBAY_AT,EBAY_AU,EBAY_BE,EBAY_CA,EBAY_CH,EBAY_CN,EBAY_CZ,EBAY_DE,EBAY_DK,EBAY_ES,EBAY_FI,EBAY_FR,EBAY_GB,EBAY_GR,EBAY_HK,EBAY_HU,EBAY_ID,EBAY_IE,EBAY_IL,EBAY_IN,EBAY_IT,EBAY_JP,EBAY_MY,EBAY_NL,EBAY_NO,EBAY_NZ,EBAY_PE,EBAY_PH,EBAY_PL,EBAY_PR,EBAY_PT,EBAY_RU,EBAY_SE,EBAY_SG,EBAY_TH,EBAY_TW,EBAY_US,EBAY_VN,EBAY_ZA,EBAY_HALF_US,EBAY_MOTORS_US]",
        "name": "string",
        "refundMethod": "RefundMethodEnum : [MERCHANDISE_CREDIT,MONEY_BACK]",
        "restockingFeePercentage": "string",
        "returnInstructions": "string",
        "returnMethod": "ReturnMethodEnum : [EXCHANGE,REPLACEMENT]",
        "returnPeriod": {
          "unit": "TimeDurationUnitEnum : [YEAR,MONTH,DAY,HOUR,CALENDAR_DAY,BUSINESS_DAY,MINUTE,SECOND,MILLISECOND]",
          "value": "integer"
        },
        "returnPolicyId": "string",
        "returnsAccepted": "boolean",
        "returnShippingCostPayer": "ReturnShippingCostPayerEnum : [BUYER,SELLER]"
}
