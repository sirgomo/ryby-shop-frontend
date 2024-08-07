import { CountryCodeEnum } from "../CountryCodeEnum";
import { MarketplaceEnum } from "../iEbayOffer";

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
    marketplaceId: MarketplaceEnum;
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