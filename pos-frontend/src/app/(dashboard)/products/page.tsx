import { fetchProducts } from "../../../../lib/fetchProducts";
import ProductsTable from "./tables";

export default async function ProductsPage() {
  const initialResponse = await fetchProducts({
    page: 1,
    per_page: 10,
  });

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your inventory, stock levels & pricing.
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-card border rounded-xl p-4">
        <ProductsTable initialData={initialResponse.data} />
      </div>

    </div>
  );
}
