export function calculateProductPricing(item) {
  const p = item.product;
  const qty = item.quantity;
  const price = parseFloat(p.price);

  let itemTotal = price * qty;
  let discountAmount = 0;
  let freeQty = 0;

  const now = new Date();

  if (p.discount && p.discount_or_trade_offer_start_date && p.discount_or_trade_offer_end_date) {
    const start = new Date(p.discount_or_trade_offer_start_date);
    const end = new Date(p.discount_or_trade_offer_end_date);

    if (now >= start && now <= end) {
      const discountPercent = parseFloat(p.discount);
      discountAmount = (itemTotal * discountPercent) / 100;
    }
  }

  if (p.trade_offer_min_qty && p.trade_offer_get_qty) {
    const min = Number(p.trade_offer_min_qty);
    const get = Number(p.trade_offer_get_qty);

    const offerBundles = Math.floor(qty / min);
    freeQty = offerBundles * get;

    const payableQty = qty - freeQty;
    itemTotal = payableQty * price;
  }

  const finalPrice = itemTotal - discountAmount;

  return {
    itemTotal,
    discountAmount,
    freeQty,
    finalPrice,
  };
}
