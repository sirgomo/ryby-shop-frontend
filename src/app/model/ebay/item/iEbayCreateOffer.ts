import { CountryCodeEnum } from "../CountryCodeEnum";

export interface iEbayCreateOffer {
    availableQuantity: number;
    categoryId: string;
    charity?: {
      charityId: string;
      donationPercentage: string;
    };
    extendedProducerResponsibility?: {
      ecoParticipationFee?: {
        currency: string;
        value: string;
      };
      producerProductId?: string;
      productDocumentationId?: string;
      productPackageId?: string;
      shipmentPackageId?: string;
    };
    format: 'AUCTION' | 'FIXED_PRICE';
    hideBuyerDetails?: boolean;
    includeCatalogProductDetails?: boolean;
    listingDescription: string;
    listingDuration: 'DAYS_1' | 'DAYS_3' | 'DAYS_5' | 'DAYS_7' | 'DAYS_10' | 'DAYS_21' | 'DAYS_30' | 'GTC';
    listingPolicies: {
      bestOfferTerms?: {
        autoAcceptPrice?: {
          currency: string;
          value: string;
        };
        autoDeclinePrice?: {
          currency: string;
          value: string;
        };
        bestOfferEnabled?: boolean;
      };
      eBayPlusIfEligible?: boolean;
      fulfillmentPolicyId: string;
      paymentPolicyId: string;
      productCompliancePolicyIds?: string[];
      regionalProductCompliancePolicies?: {
        countryPolicies: Array<{
          country: CountryCodeEnum;
          policyIds: string[];
        }>;
      };
      regionalTakeBackPolicies?: {
        countryPolicies: Array<{
          country: CountryCodeEnum;
          policyIds: string[];
        }>;
      };
      returnPolicyId: string;
      shippingCostOverrides?: Array<{
        additionalShippingCost?: {
          currency: string;
          value: string;
        };
        priority: number;
        shippingCost?: {
          currency: string;
          value: string;
        };
        shippingServiceType: 'DOMESTIC' | 'INTERNATIONAL';
        surcharge?: {
          currency: string;
          value: string;
        };
      }>;
      takeBackPolicyId?: string;
    };
    listingStartDate?: string;
    lotSize?: number;
    marketplaceId: 'EBAY_US' | 'EBAY_MOTORS' | 'EBAY_CA' | 'EBAY_GB' | 'EBAY_AU' | 'EBAY_AT' | 'EBAY_BE' | 'EBAY_FR' | 'EBAY_DE' | 'EBAY_IT' | 'EBAY_NL' | 'EBAY_ES' | 'EBAY_CH' | 'EBAY_TW' | 'EBAY_CZ' | 'EBAY_DK' | 'EBAY_FI' | 'EBAY_GR' | 'EBAY_HK' | 'EBAY_HU' | 'EBAY_IN' | 'EBAY_ID' | 'EBAY_IE' | 'EBAY_IL' | 'EBAY_MY' | 'EBAY_NZ' | 'EBAY_NO' | 'EBAY_PH' | 'EBAY_PL' | 'EBAY_PT' | 'EBAY_PR' | 'EBAY_RU' | 'EBAY_SG' | 'EBAY_ZA' | 'EBAY_SE' | 'EBAY_TH' | 'EBAY_VN' | 'EBAY_CN' | 'EBAY_PE' | 'EBAY_JP';
    merchantLocationKey?: string;
    pricingSummary: {
      auctionReservePrice?: {
        currency: string;
        value: string;
      };
      auctionStartPrice?: {
        currency: string;
        value: string;
      };
      minimumAdvertisedPrice?: {
        currency: string;
        value: string;
      };
      originallySoldForRetailPriceOn?: 'ON_EBAY' | 'OFF_EBAY' | 'ON_AND_OFF_EBAY';
      originalRetailPrice?: {
        currency: string;
        value: string;
      };
      price: {
        currency: string;
        value: string;
      };
      pricingVisibility?: 'NONE' | 'PRE_CHECKOUT' | 'DURING_CHECKOUT';
    };
    quantityLimitPerBuyer?: number;
    regulatory?: {
      economicOperator?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        companyName: string;
        country: CountryCodeEnum;
        email?: string;
        phone?: string;
        postalCode: string;
        stateOrProvince?: string;
      };
      energyEfficiencyLabel?: {
        imageDescription?: string;
        imageURL?: string;
        productInformationSheet?: string;
      };
      hazmat?: {
        component?: string;
        pictograms?: string[];
        signalWord?: string;
        statements?: string[];
      };
      repairScore?: number;
    };
    secondaryCategoryId?: string;
    sku?: string;
    storeCategoryNames?: string[];
    tax?: {
      applyTax?: boolean;
      thirdPartyTaxCategory?: string;
      vatPercentage?: number;
    };
}