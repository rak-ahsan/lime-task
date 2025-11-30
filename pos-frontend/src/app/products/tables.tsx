"use client";

import { useState, useEffect } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/lib/api";

export default function ProductsTable({ initialData }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.current_page);

  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [search, setSearch] = useState("");

  const lastPage = data.last_page;

  // -----------------------------
  // LOAD PRODUCTS (pagination)
  // -----------------------------
  async function loadProducts(newPage) {
    try {
      setLoading(true);
      const json = await api.get(
        `products?page=${newPage}&per_page=10&search=${search}`
      );
      setData(json.data);
      setSelected([]);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (page !== initialData.current_page) {
      loadProducts(page);
    }
  }, [page]);

  // -----------------------------
  // SEARCH PRODUCTS
  // -----------------------------
  async function handleSearch(value: string) {
    setSearch(value);
    setPage(1);

    if (!value.trim()) {
      loadProducts(1);
      return;
    }

    setSearching(true);

    try {
      const json = await api.get(
        `products?search=${value}&page=1&per_page=10`
      );
      setData(json.data);
      setSelected([]);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  }

  // -----------------------------
  // SELECTION HANDLERS
  // -----------------------------
  const allSelected =
    selected.length === data.data.length && data.data.length > 0;

  const toggleRow = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(data.data.map((p) => p.id));
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center justify-between mb-2">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
        />

        {selected.length > 0 && (
          <span className="text-sm font-medium text-blue-600">
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Table */}
      <Table className="rounded-md border">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
            </TableHead>

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

        <TableBody className="min-h-[300px]">
          {loading || searching ? (
            [...Array(10)].map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                {/* Checkbox */}
                <TableCell>
                  <Skeleton color="dark" className="h-4 w-4" />
                </TableCell>

                {/* Image */}
                <TableCell>
                  <Skeleton color="gray" className="h-12 w-12 rounded-md" />
                </TableCell>

                {/* ID */}
                <TableCell>
                  <Skeleton color="dark" className="h-4 w-24" />
                </TableCell>

                {/* Name */}
                <TableCell>
                  <Skeleton color="gray" className="h-4 w-28" />
                </TableCell>

                {/* Price */}
                <TableCell>
                  <Skeleton color="dark" className="h-4 w-14" />
                </TableCell>

                {/* Stock */}
                <TableCell>
                  <Skeleton color="dark" className="h-4 w-10" />
                </TableCell>

                {/* Min Stock */}
                <TableCell>
                  <Skeleton color="dark" className="h-4 w-12" />
                </TableCell>

                {/* Discount */}
                <TableCell>
                  <Skeleton color="gray" className="h-4 w-10" />
                </TableCell>

                {/* Trade Offer */}
                <TableCell>
                  <Skeleton color="gray" className="h-4 w-32" />
                </TableCell>
              </TableRow>
            ))
          ) : data.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            data.data.map((p) => {
              const isSelected = selected.includes(p.id);

              return (
                <TableRow
                  key={p.id}
                  className={
                    isSelected
                      ? "bg-blue-50"
                      : p.stock <= p.min_stock
                      ? "bg-red-50/50"
                      : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(p.id)}
                    />
                  </TableCell>

                  {/* IMAGE */}
                  <TableCell>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                  </TableCell>

                  {/* ID */}
                  <TableCell className="text-xs">{p.id}</TableCell>

                  {/* Name */}
                  <TableCell className="font-medium">{p.name}</TableCell>

                  {/* Price */}
                  <TableCell>${p.price}</TableCell>

                  {/* Stock */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {p.stock}
                      {p.stock <= p.min_stock && (
                        <Badge variant="destructive">Low</Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Min Stock */}
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
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <PaginationContent className="flex justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={page <= 1 ? "opacity-40 pointer-events-none" : ""}
            />
          </PaginationItem>

          {[...Array(lastPage)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => page < lastPage && setPage(page + 1)}
              className={page >= lastPage ? "opacity-40 pointer-events-none" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
