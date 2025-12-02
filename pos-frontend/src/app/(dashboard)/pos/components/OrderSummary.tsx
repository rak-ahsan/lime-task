"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

export default function OrderSummary({
  totals,
  processingSale,
  onProcessSale,
  onClearCart,
}: {
  totals: {
    subtotal: string;
    totalDiscount: string;
    finalTotal: string;
  };
  processingSale: boolean;
  onProcessSale: () => void;
  onClearCart: () => void;
}) {
  const { cart } = useCart();

  return (
    <Card className="col-span-full md:col-span-3 lg:col-span-1">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-2">
        <div className="flex justify-between">
          <Label>Subtotal:</Label>
          <span>${totals.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <Label>Total Discount:</Label>
          <span className="text-red-500">-${totals.totalDiscount}</span>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <Label>Final Payable:</Label>
          <span>${totals.finalTotal}</span>
        </div>
      </CardContent>

      <CardFooter className="flex-col">
        <Button
          className="w-full"
          onClick={onProcessSale}
          disabled={cart.length === 0 || processingSale}
        >
          {processingSale ? "Processing..." : "Process Sale"}
        </Button>

        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={onClearCart}
          disabled={cart.length === 0}
        >
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
