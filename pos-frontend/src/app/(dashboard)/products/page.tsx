import { fetchProducts } from "../../../../lib/fetchProducts";
import ProductCreate from "./components/create/product-create-form";
import ProductsTable from "./components/tables";

export default async function ProductsPage({ searchParams }) {
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
        <ProductsTable data={response.data} />

      </div>
    </div>
  );
}