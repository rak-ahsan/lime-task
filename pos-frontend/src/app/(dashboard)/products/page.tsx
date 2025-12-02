import { fetchProducts } from "./components/action";
import ProductsTable from "./components/tables";

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string; search?: string } }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const search = params.search ?? "";

  const response = await fetchProducts({
    page,
    per_page: 15,
    search,
  });  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your inventory, stock levels & pricing.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-4">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error */}
        <ProductsTable data={response.data} />
      </div>
    </div>
  );
}