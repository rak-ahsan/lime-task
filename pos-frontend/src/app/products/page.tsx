import { fetchProducts } from "../../../lib/fetchProducts";
import ProductsTable from "./tables";

export default async function ProductsPage() {
  const initialResponse = await fetchProducts({
    page: 1,
    per_page: 10,
  });

  return (
    <div className=" min-h-screen p-4 bg-gray-100">
      <ProductsTable initialData={initialResponse.data} />
    </div>
  );
}
