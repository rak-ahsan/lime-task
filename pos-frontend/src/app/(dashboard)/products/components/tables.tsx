import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import SearchBox from "./SearchBox";
import PaginationLinks from "./PaginationLinks";
import ProductForm from "./create/product-create-form";
import { Product } from "../../../../../types/types";

interface ProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
}

interface ProductsTableProps {
  data: ProductsResponse;
}

export default function ProductsTable({ data }: ProductsTableProps) {
  const { data: products, current_page, last_page } = data;

  return (
    <div className="space-y-6">
      {/* Search & Create */}
      <div className="flex justify-between">
        <SearchBox />
        <ProductForm />
      </div>

      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Trade Offer</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((p: Product) => (
              <TableRow
                key={p.id}
                className={
                  p.stock < 10 || p.stock <= p.min_stock
                    ? "bg-red-50/50"
                    : ""
                }
              >
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                </TableCell>

                <TableCell>{p.id}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>

                {/* Stock — with Low Stock logic */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {p.stock}

                    {p.stock < p.min_stock ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : p.stock <= p.min_stock ? (
                      <Badge variant="destructive">Low</Badge>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell>{p.min_stock}</TableCell>

                {/* Discount */}
                <TableCell>
                  {p.discount ? (
                    <Badge variant="secondary">{p.discount}%</Badge>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>

                {/* Trade Offer */}
                <TableCell>
                  {p.trade_offer_min_qty ? (
                    <Badge variant="outline">
                      Buy {p.trade_offer_min_qty} → Free {p.trade_offer_get_qty}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationLinks current={current_page} last={last_page} />
    </div>
  );
}
