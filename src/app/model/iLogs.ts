export interface iLogs {
  id: number;
  ebay_transaction_id: string;
  user_email: string;
  paypal_transaction_id: string;
  error_class: LOGS_CLASS;
  error_message: string;
  created_at: Date;
}

export enum LOGS_CLASS {
  PAYPAL = 'PAYPAL',
  EBAY = 'EBAY',
  EBAY_ERROR = 'EBAY_ERROR',
  PAYPAL_ERROR = 'PAYPAL_ERROR',
  SERVER_LOG = 'SERVER_LOG',
  SUCCESS_LOG = 'SUCCESS_LOG',
  DELETE = 'DELETE',
  WARENEINGANG = 'WARENEINGANG',
  NULL = 'NULL'
}
