import { Suspense } from "react";
import ProductsTable from "./components/tables";
import ProductsTableSkeleton from "./components/loading";

// Create a separate Server Component for fetching
async function ProductsTableWrapper({ page, search }: { page: number; search: string }) {
  const { fetchProducts } = await import("./components/action");
  
  const response = await fetchProducts({
    page,
    per_page: 15,
    search,
  });
  
  return <ProductsTable data={response.data} />;
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: { page?: string; search?: string } 
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your inventory, stock levels & pricing.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-4">
        <Suspense fallback={<ProductsTableSkeleton />}>
          <ProductsTableWrapper page={page} search={search} />
        </Suspense>
      </div>
    </div>
  );
}