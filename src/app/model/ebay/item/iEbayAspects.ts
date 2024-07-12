export enum AspectApplicableToEnum {
    ITEM = 'ITEM',
    PRODUCT = 'PRODUCT'
  }
  
  export enum AspectDataTypeEnum {
    DATE = 'DATE',
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    STRING_ARRAY = 'STRING_ARRAY'
  }
  
  export enum AspectModeEnum {
    FREE_TEXT = 'FREE_TEXT',
    SELECTION_ONLY = 'SELECTION_ONLY'
  }
  
  export enum AspectUsageEnum {
    RECOMMENDED = 'RECOMMENDED',
    OPTIONAL = 'OPTIONAL'
  }
  
  export enum ItemToAspectCardinalityEnum {
    MULTI = 'MULTI',
    SINGLE = 'SINGLE'
  }
  
  export interface ValueConstraint {
    applicableForLocalizedAspectName: string;
    applicableForLocalizedAspectValues: string[];
  }
  
  export interface AspectValue {
    localizedValue: string;
    valueConstraints: ValueConstraint[];
  }
  
  export interface RelevanceIndicator {
    searchCount: number;
  }
  
  export interface AspectConstraint {
    aspectApplicableTo: AspectApplicableToEnum[];
    aspectDataType: AspectDataTypeEnum;
    aspectEnabledForVariations: boolean;
    aspectFormat: string;
    aspectMaxLength: number;
    aspectMode: AspectModeEnum;
    aspectRequired: boolean;
    aspectUsage: AspectUsageEnum;
    expectedRequiredByDate: string;
    itemToAspectCardinality: ItemToAspectCardinalityEnum;
  }
  
  export interface iEbayAspect {
    aspectConstraint: AspectConstraint;
    aspectValues: AspectValue[];
    localizedAspectName: string;
    relevanceIndicator: RelevanceIndicator;
  }
  
  export interface iEbayAspects {
    aspects: iEbayAspect[];
  }