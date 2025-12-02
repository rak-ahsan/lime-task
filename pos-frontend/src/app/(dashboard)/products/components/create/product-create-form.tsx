"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProductAction, updateProductAction } from "./actions";
import { SelectSeparator } from "@/components/ui/select";
import { toast } from "sonner";

export default function ProductForm({ product = null }: { product?: any }) {
  const [errors, setErrors] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const isEdit = !!product;

  function submitToServer(formData: FormData) {
    setErrors(null);

    startTransition(async () => {
      const res = isEdit
        ? await updateProductAction(product.id, formData)
        : await createProductAction(formData);

      if (!res.success) {
        setErrors(res.errors);
        toast.error(res.message);
        return;
      }

      console.log(res);


      setOpen(false);
      toast.success(isEdit ? "Product updated!" : "Product created!");
    });
  }

  function validateAndSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const file = formData.get("image") as File | null;

    if (file && file.size > 1 * 1024 * 1024) {
      setErrors({ image: "Image must be less than 1 MB" });
      toast.error("Image must be less than 1 MB");
      return;
    }

    submitToServer(formData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold">
          {isEdit ? "Edit" : "Add Product"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEdit ? "Update Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={validateAndSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <div className="space-y-4">
            <p className="font-medium text-sm text-muted-foreground">
              Basic Information
            </p>

            <div>
              <Label>Name</Label>
              <Input
                name="name"
                required
                defaultValue={product?.name}
                className="mt-1"
              />
              {errors?.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  defaultValue={product?.price}
                  className="mt-1"
                />
                {errors?.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>

              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  name="stock"
                  required
                  defaultValue={product?.stock}
                  className="mt-1"
                />
                {errors?.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </div>
              <div>
                <Label>Min Stock</Label>
                <Input
                  type="number"
                  name="min_stock"
                  defaultValue={product?.min_stock}
                  className="mt-1"
                />
              </div>

            </div>
          </div>

          <SelectSeparator />

          {/* OFFERS */}
          <div className="space-y-4">
            <p className="font-medium text-sm text-muted-foreground">
              Offers & Discounts
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Trade Offer Min Qty</Label>
                <Input
                  type="number"
                  name="trade_offer_min_qty"
                  defaultValue={product?.trade_offer_min_qty}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Trade Offer Get Qty</Label>
                <Input
                  type="number"
                  name="trade_offer_get_qty"
                  defaultValue={product?.trade_offer_get_qty}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                step="0.01"
                name="discount"
                defaultValue={product?.discount}
                className="mt-1"
              />
              {errors?.discount && (
                <p className="text-red-500 text-sm">{errors.discount}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  name="discount_or_trade_offer_start_date"
                  defaultValue={product?.discount_or_trade_offer_start_date}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  name="discount_or_trade_offer_end_date"
                  defaultValue={product?.discount_or_trade_offer_end_date}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <SelectSeparator />

          {/* IMAGE */}
          <div className="space-y-2">
            <p className="font-medium text-sm text-muted-foreground">
              Product Image
            </p>

            <Input
              type="file"
              name="image"
              accept="image/*"
              className="cursor-pointer"
              required={!isEdit}  // only required for create mode
            />

            {errors?.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-3 font-semibold text-base"
          >
            {isPending
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update Product"
                : "Save Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
