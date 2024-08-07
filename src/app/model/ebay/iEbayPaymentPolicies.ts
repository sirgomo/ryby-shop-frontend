export interface iEbayPaymentPolicies {
    "categoryTypes": [
      {
        "default": "boolean",
        "name": "CategoryTypeEnum : [MOTORS_VEHICLES,ALL_EXCLUDING_MOTORS_VEHICLES]"
      }
    ],
    "deposit": {
      "amount": {
        "currency": "CurrencyCodeEnum : [AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTN,BWP,BYR,BZD,CAD,CDF,CHF,CLP,CNY,COP,CRC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,INR,IQD,IRR,ISK,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XCD,XOF,XPF,YER,ZAR,ZMW,ZWL]",
        "value": "string"
      },
      "dueIn": {
        "unit": "TimeDurationUnitEnum : [YEAR,MONTH,DAY,HOUR,CALENDAR_DAY,BUSINESS_DAY,MINUTE,SECOND,MILLISECOND]",
        "value": "integer"
      },
      "paymentMethods": [
        {
          "brands": [
            "PaymentInstrumentBrandEnum"
          ],
          "paymentMethodType": "PaymentMethodTypeEnum : [CASH_IN_PERSON,CASH_ON_DELIVERY,CASH_ON_PICKUP,CASHIER_CHECK,CREDIT_CARD,ESCROW,INTEGRATED_MERCHANT_CREDIT_CARD,LOAN_CHECK,MONEY_ORDER,PAISA_PAY,PAISA_PAY_ESCROW,PAISA_PAY_ESCROW_EMI,PAYPAL,PERSONAL_CHECK,OTHER]",
          "recipientAccountReference": {
            "referenceId": "string",
            "referenceType": "RecipientAccountReferenceTypeEnum : [PAYPAL_EMAIL]"
          }
        }
      ]
    },
    "description": "string",
    "fullPaymentDueIn": {
      "unit": "TimeDurationUnitEnum : [YEAR,MONTH,DAY,HOUR,CALENDAR_DAY,BUSINESS_DAY,MINUTE,SECOND,MILLISECOND]",
      "value": "integer"
    },
    "immediatePay": "boolean",
    "marketplaceId": "MarketplaceIdEnum : [EBAY_AT,EBAY_AU,EBAY_BE,EBAY_CA,EBAY_CH,EBAY_CN,EBAY_CZ,EBAY_DE,EBAY_DK,EBAY_ES,EBAY_FI,EBAY_FR,EBAY_GB,EBAY_GR,EBAY_HK,EBAY_HU,EBAY_ID,EBAY_IE,EBAY_IL,EBAY_IN,EBAY_IT,EBAY_JP,EBAY_MY,EBAY_NL,EBAY_NO,EBAY_NZ,EBAY_PE,EBAY_PH,EBAY_PL,EBAY_PR,EBAY_PT,EBAY_RU,EBAY_SE,EBAY_SG,EBAY_TH,EBAY_TW,EBAY_US,EBAY_VN,EBAY_ZA,EBAY_HALF_US,EBAY_MOTORS_US]",
    "name": "string",
    "paymentInstructions": "string",
    "paymentMethods": [
      {
        "brands": [
          "PaymentInstrumentBrandEnum"
        ],
        "paymentMethodType": "PaymentMethodTypeEnum : [CASH_IN_PERSON,CASH_ON_DELIVERY,CASH_ON_PICKUP,CASHIER_CHECK,CREDIT_CARD,ESCROW,INTEGRATED_MERCHANT_CREDIT_CARD,LOAN_CHECK,MONEY_ORDER,PAISA_PAY,PAISA_PAY_ESCROW,PAISA_PAY_ESCROW_EMI,PAYPAL,PERSONAL_CHECK,OTHER]",
        "recipientAccountReference": {
          "referenceId": "string",
          "referenceType": "RecipientAccountReferenceTypeEnum : [PAYPAL_EMAIL]"
        }
      }
    ],
    "paymentPolicyId": "string"
  }