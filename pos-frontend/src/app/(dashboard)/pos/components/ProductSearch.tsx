"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "../../../../../types/types";

export default function ProductSearch({
  searchTerm,
  setSearchTerm,
  searchResults,
  loadingSearch,
  onSelectProduct
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  searchResults: Product[];
  loadingSearch: boolean;
  onSelectProduct: (p: Product) => void;
}) {
  return (
    <Card className="col-span-full md:col-span-1 h-fit">
      <CardHeader>
        <CardTitle>Product Search</CardTitle>
      </CardHeader>

      <CardContent>
        <Input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loadingSearch && <p>Loading products...</p>}

        {searchResults.length > 0 && (
          <div className="border rounded-md max-h-60 overflow-y-auto">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => onSelectProduct(product)}
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    ${product.price} — Stock: {product.stock}
                  </p>
                </div>

                {product.stock <= product.min_stock && (
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {searchTerm.length >= 2 &&
          !loadingSearch &&
          searchResults.length === 0 && (
            <p className="text-sm text-gray-500">No products found.</p>
          )}
      </CardContent>
    </Card>
  );
}
