import { getInitialPosProducts } from "./components/actions";
import PosClient from "./components/PosClient";

export default async function PosPage() {
  const initialProducts = await getInitialPosProducts();

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
      <p className="text-muted-foreground">
        Process sales and manage transactions.
      </p>

      <PosClient initialProducts={initialProducts} />
    </div>
  );
}
