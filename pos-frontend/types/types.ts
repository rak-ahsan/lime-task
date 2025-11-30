// types.ts
export type CustomerGroup = "walkin" | "regular" | "dealer";

export type TimeWindow = {
  starts_at?: string; // ISO datetime
  ends_at?: string;   // ISO datetime
};

export type TradeOffer = {
  min_qty: number; // buy X
  get_qty: number; // get Y free
};

export type Tier = {
  min_qty: number; // threshold inclusive
  type: "percentage" | "fixed";
  value: number; // percent or fixed per item
};

export type DiscountDetails = {
  // Basic discount
  type?: "percentage" | "fixed";
  value?: number;

  // Trade offer
  trade_offer?: TradeOffer;

  // Tiered discounts
  tiers?: Tier[]; // ordered by min_qty ascending

  // Time window
  time_window?: TimeWindow;

  // Customer group overrides
  customer_group_overrides?: Partial<Record<CustomerGroup, { type: "percentage" | "fixed"; value: number }>>;
};

export type Product = {
  id: string;
  name: string;
  price: number; // unit price
  stock: number;
  min_stock?: number;
  discount_details?: DiscountDetails;
};
