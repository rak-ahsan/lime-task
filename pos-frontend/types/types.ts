export type CustomerGroup = "walkin" | "regular" | "dealer";

export type TimeWindow = {
  starts_at?: string;
  ends_at?: string;
};

export type TradeOffer = {
  min_qty: number;
  get_qty: number;
};

export type Tier = {
  min_qty: number;
  type: "percentage" | "fixed";
  value: number;
};

export type DiscountDetails = {
  type?: "percentage" | "fixed";
  value?: number;

  trade_offer?: TradeOffer;

  tiers?: Tier[];

  time_window?: TimeWindow;

  customer_group_overrides?: Partial<
    Record<CustomerGroup, { type: "percentage" | "fixed"; value: number }>
  >;
};

export interface Product {
  id: string;                  
  name: string;
  price: number;
  stock: number;
  min_stock: number;
  image: string;
  discount?: number | null;
  discount_details?: DiscountDetails;
  trade_offer_get_qty?: number;
  trade_offer_min_qty?:number
}
