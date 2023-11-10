import { iEbayOrder } from "./iEbayOrder"

export interface iEbayAllOrders {
  "href": "string",
  "limit": "integer",
  "next": "string",
  "offset": "integer",
  "orders": iEbayOrder[],
  "prev": "string",
  "total": "integer",
  "warnings": [
    {
      "category": "string",
      "domain": "string",
      "errorId": "integer",
      "inputRefIds": [
        "string"
      ],
      "longMessage": "string",
      "message": "string",
      "outputRefIds": [
        "string"
      ],
      "parameters": [
        {
          "name": "string",
          "value": "string"
        }
      ],
      "subdomain": "string"
    }
  ]
}
