"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SaleBreakdownResponse } from "../../../../../types/types";
import { formatCurrency } from "@/lib/utils";



const SaleBreakDown = ({
  breakdown,
  open,
  onClose,
}: {
  breakdown: SaleBreakdownResponse | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!breakdown) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Sale Breakdown</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {breakdown.items.map((it:any, idx) => (
            <div
              key={`${String(it.product_id)}-${idx}`}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-medium">{it.product_name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Qty: {it.quantity} × {formatCurrency(it.unit_price)}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="font-semibold text-lg">
                    {formatCurrency(it.net_amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Subtotal {formatCurrency(it.subtotal)}
                  </div>
                </div>
              </div>

              {(it.discount_amount > 0 ||
                (it.trade_offer_applied && it.trade_offer_text)) && (
                <div className="pt-2 border-t space-y-1 text-sm">
                  {it.discount_amount > 0 && (
                    <div className="text-green-600">
                      Discount: -{formatCurrency(it.discount_amount)}
                    </div>
                  )}

                  {it.trade_offer_applied && it.trade_offer_text && (
                    <div className="text-blue-600">
                      Offer: {it.trade_offer_text}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="border-t-2 pt-4 space-y-3 bg-white">
            <div className="flex justify-between text-base">
              <div className="font-medium">Total (before discounts)</div>
              <div className="font-semibold">
                {formatCurrency(breakdown.total_subtotal)}
              </div>
            </div>

            {breakdown.total_discount > 0 && (
              <div className="flex justify-between text-base">
                <div className="font-medium">Total Discount</div>
                <div className="font-semibold text-green-600">
                  -{formatCurrency(breakdown.total_discount)}
                </div>
              </div>
            )}

            {breakdown.total_trade_offer_deduction > 0 && (
              <div className="flex justify-between text-base">
                <div className="font-medium">Trade Offer Deduction</div>
                <div className="font-semibold text-blue-600">
                  -{formatCurrency(breakdown.total_trade_offer_deduction)}
                </div>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold pt-3 border-t-2">
              <div>Final Payable</div>
              <div className="text-primary">
                {formatCurrency(breakdown.final_total)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleBreakDown;
