export interface Category {
    categoryId: string;
    categoryName: string;
  }
  
  export interface AncestorReference {
    categoryId: string;
    categoryName: string;
    categorySubtreeNodeHref: string;
    categoryTreeNodeLevel: number;
  }
  
  export interface CategorySuggestion {
    category: Category;
    categoryTreeNodeAncestors: AncestorReference[];
    categoryTreeNodeLevel: number;
    relevancy: string;
  }
  
  export interface iEbayCategorySugestion {
    categorySuggestions: CategorySuggestion[];
    categoryTreeId: string;
    categoryTreeVersion: string;
  }