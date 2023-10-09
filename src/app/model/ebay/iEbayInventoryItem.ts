export interface iEbayInventoryItem {
  availability?: {
    pickupAtLocationAvailability?: [
      {
        availabilityType?: AvailabilityTypeEnum;
        fulfillmentTime?: {
          unit?: TimeDurationUnitEnum;
          value?: number;
        };
        merchantLocationKey?: string;
        quantity?: number;
      }
    ];
    shipToLocationAvailability?: {
      allocationByFormat?: {
        auction?: number;
        fixedPrice?: number;
      };
      availabilityDistributions?: [
        {
          fulfillmentTime?: {
            unit?: TimeDurationUnitEnum;
            value?: number;
          };
          merchantLocationKey?: string;
          quantity?: number;
        }
      ];
      quantity?: number;
    };
  };
  condition?: ConditionEnum;
  conditionDescription?: string;
  conditionDescriptors?: [
    {
      additionalInfo?: string;
      name?: string;
      values?: string[];
    }
  ];
  groupIds?: string[];
  inventoryItemGroupKeys?: string[];
  locale: LocaleEnum;
  packageWeightAndSize?: {
    dimensions?: {
      height?: number;
      length?: number;
      unit?: LengthUnitOfMeasureEnum;
      width?: number;
    };
    packageType?: PackageTypeEnum;
    weight?: {
      unit?: WeightUnitOfMeasureEnum;
      value?: number;
    };
  };
  product?: {
    aspects?: string;
    brand?: string;
    description: string;
    ean?: string[];
    epid?: string;
    imageUrls?: string[];
    isbn?: string[];
    mpn?: string;
    subtitle?: string;
    title?: string;
    upc?: string[];
    videoIds?: string[];
  };
  sku?: string;
}

export enum AvailabilityTypeEnum {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  SHIP_TO_STORE = 'SHIP_TO_STORE',
}
export enum TimeDurationUnitEnum {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  DAY = 'DAY',
  HOUR = 'HOUR',
  CALENDAR_DAY = 'CALENDAR_DAY',
  BUSINESS_DAY = 'BUSINESS_DAY',
  MINUTE = 'MINUTE',
  SECOND = 'SECOND',
  MILLISECOND = 'MILLISECOND',
}
export enum ConditionEnum {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  NEW_OTHER = 'NEW_OTHER',
  NEW_WITH_DEFECTS = 'NEW_WITH_DEFECTS',
  MANUFACTURER_REFURBISHED = 'MANUFACTURER_REFURBISHED',
  CERTIFIED_REFURBISHED = 'CERTIFIED_REFURBISHED',
  EXCELLENT_REFURBISHED = 'EXCELLENT_REFURBISHED',
  VERY_GOOD_REFURBISHED = 'VERY_GOOD_REFURBISHED',
  GOOD_REFURBISHED = 'GOOD_REFURBISHED',
  SELLER_REFURBISHED = 'SELLER_REFURBISHED',
  USED_EXCELLENT = 'USED_EXCELLENT',
  USED_VERY_GOOD = 'USED_VERY_GOOD',
  USED_GOOD = 'USED_GOOD',
  USED_ACCEPTABLE = 'USED_ACCEPTABLE',
  FOR_PARTS_OR_NOT_WORKING = 'FOR_PARTS_OR_NOT_WORKING',
}
export enum LocaleEnum {
  en_US = 'en_US',
  en_CA = 'en_CA',
  fr_CA = 'fr_CA',
  en_GB = 'en_GB',
  en_AU = 'en_AU',
  en_IN = 'en_IN',
  de_AT = 'de_AT',
  fr_BE = 'fr_BE',
  fr_FR = 'fr_FR',
  de_DE = 'de_DE',
  it_IT = 'it_IT',
  nl_BE = 'nl_BE',
  nl_NL = 'nl_NL',
  es_ES = 'es_ES',
  de_CH = 'de_CH',
  fi_FI = 'fi_FI',
  zh_HK = 'zh_HK',
  hu_HU = 'hu_HU',
  en_PH = 'en_PH',
  pl_PL = 'pl_PL',
  pt_PT = 'pt_PT',
  ru_RU = 'ru_RU',
  en_SG = 'en_SG',
  en_IE = 'en_IE',
  en_MY = 'en_MY',
}
export enum LengthUnitOfMeasureEnum {
  INCH = 'INCH',
  FEET = 'FEET',
  CENTIMETER = 'CENTIMETER',
  METER = 'METER',
}
export enum PackageTypeEnum {
  LETTER = 'LETTER',
  BULKY_GOODS = 'BULKY_GOODS',
  CARAVAN = 'CARAVAN',
  CARS = 'CARS',
  EUROPALLET = 'EUROPALLET',
  EXPANDABLE_TOUGH_BAGS = 'EXPANDABLE_TOUGH_BAGS',
  EXTRA_LARGE_PACK = 'EXTRA_LARGE_PACK',
  FURNITURE = 'FURNITURE',
  INDUSTRY_VEHICLES = 'INDUSTRY_VEHICLES',
  LARGE_CANADA_POSTBOX = 'LARGE_CANADA_POSTBOX',
  LARGE_CANADA_POST_BUBBLE_MAILER = 'LARGE_CANADA_POST_BUBBLE_MAILER',
  LARGE_ENVELOPE = 'LARGE_ENVELOPE',
  MAILING_BOX = 'MAILING_BOX',
  MEDIUM_CANADA_POST_BOX = 'MEDIUM_CANADA_POST_BOX',
  MEDIUM_CANADA_POST_BUBBLE_MAILER = 'MEDIUM_CANADA_POST_BUBBLE_MAILER',
  MOTORBIKES = 'MOTORBIKES',
  ONE_WAY_PALLET = 'ONE_WAY_PALLET',
  PACKAGE_THICK_ENVELOPE = 'PACKAGE_THICK_ENVELOPE',
  PADDED_BAGS = 'PADDED_BAGS',
  PARCEL_OR_PADDED_ENVELOPE = 'PARCEL_OR_PADDED_ENVELOPE',
  ROLL = 'ROLL',
  SMALL_CANADA_POST_BOX = 'SMALL_CANADA_POST_BOX',
  SMALL_CANADA_POST_BUBBLE_MAILER = 'SMALL_CANADA_POST_BUBBLE_MAILER',
  TOUGH_BAGS = 'TOUGH_BAGS',
  UPS_LETTER = 'UPS_LETTER',
  USPS_FLAT_RATE_ENVELOPE = 'USPS_FLAT_RATE_ENVELOPE',
  USPS_LARGE_PACK = 'USPS_LARGE_PACK',
  VERY_LARGE_PACK = 'VERY_LARGE_PACK',
  WINE_PAK = 'WINE_PAK',
}
export enum WeightUnitOfMeasureEnum {
  POUND = 'POUND',
  KILOGRAM = 'KILOGRAM',
  OUNCE = 'OUNCE',
  GRAM = 'GRAM',
}
