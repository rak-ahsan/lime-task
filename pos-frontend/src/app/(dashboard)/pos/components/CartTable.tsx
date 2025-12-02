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
import { calculateProductPricing } from "../../../../../lib/pricing";
import { useCart } from "@/context/cart-context";

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
          <p className="text-center text-gray-500">No items in cart.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px]">Qty</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cart.map((item) => {
                const c = calculateProductPricing(item);

                return (
                  <TableRow key={item.product.id}>
                    <TableCell className="font-medium">
                      {item.product.name}
                      {c.freeQty > 0 && (
                        <p className="text-xs text-blue-500">
                          Free: {c.freeQty} items (Trade Offer)
                        </p>
                      )}
                    </TableCell>

                    <TableCell>${item.product.price}</TableCell>

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
                      {item.product.discount
                        ? `${item.product.discount}%`
                        : "—"}
                    </TableCell>

                    <TableCell className="font-semibold">
                      ${c.finalPrice.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(item.product.id)}
                      >
                        X
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
