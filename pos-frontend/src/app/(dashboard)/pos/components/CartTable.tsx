"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { calculateProductPricing } from "../../../../../lib/pricing";
import { useCart } from "@/context/cart-context";
import { Product } from "../../../../../types/types";

export default function CartTable({
  onQtyChange,
  onRemove,
}: {
  onQtyChange: (id: string, v: string) => void;
  onRemove: (id: string) => void;
}) {
  const { cart } = useCart();

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle>Current Sale</CardTitle>
      </CardHeader>

      <CardContent>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No items in cart.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px]">Qty</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cart.map((item:any) => {
                const c = calculateProductPricing(item);
                
                const now = new Date();
                const startDate = item.product.discount_or_trade_offer_start_date 
                  ? new Date(item.product.discount_or_trade_offer_start_date) 
                  : null;
                const endDate = item.product.discount_or_trade_offer_end_date 
                  ? new Date(item.product.discount_or_trade_offer_end_date) 
                  : null;
                
                const isOfferActive = 
                  (!startDate || now >= startDate) && 
                  (!endDate || now <= endDate);
                
                const hasDiscount = 
                  item.product.discount && 
                  item.product.discount > 0 && 
                  isOfferActive;
                
                const subtotal = item.product.price * item.quantity;

                return (
                  <TableRow key={item.product.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span>{item.product.name}</span>
                        
                        {hasDiscount && (
                          <Badge variant="secondary" className="w-fit text-xs">
                            {item.product.discount}% OFF
                          </Badge>
                        )}
                        
                        {c.freeQty > 0 && isOfferActive && (
                          <span className="text-xs text-blue-600 font-medium">
                            🎁 Free: {c.freeQty} items (Trade Offer)
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span>${Number(item.product.price).toFixed(2)}</span>
                        {hasDiscount && (
                          <span className="text-xs text-gray-500 line-through">
                            ${Number(item.product.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.product.stock}
                        className="w-16 h-8 text-center"
                        onChange={(e) =>
                          onQtyChange(item.product.id, e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <span className="text-gray-600">
                        ${subtotal.toFixed(2)}
                      </span>
                    </TableCell>

                    <TableCell>
                      {hasDiscount ? (
                        <span className="text-green-600 font-medium">
                          -${c.discountAmount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    <TableCell className="font-semibold text-lg">
                      ${c.finalPrice.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(item.product.id)}
                      >
                        ✕
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}