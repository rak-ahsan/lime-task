import { api, Product } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getCookie } from '@/lib/utils'; // Import getCookie

async function getProducts(): Promise<Product[]> {
  const token = typeof window !== 'undefined' ? getCookie('authToken') : null;

  try {
    const products = await api.get<Product[]>('products', token);
    return products;
  } catch (error) {
    console.log('Failed to fetch products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="flex min-h-screen p-4 bg-gray-100">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>View all available products and their stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Trade Offer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className={product.stock <= product.min_stock ? 'bg-red-50/50' : ''}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        {product.stock}
                        {product.stock <= product.min_stock && (
                          <Badge variant="destructive" className="ml-2">Low Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell>{product.min_stock}</TableCell>
                      <TableCell>
                        {product.discount_details
                          ? (product.discount_details.type === 'percentage'
                              ? `${product.discount_details.value}%`
                              : `$${product.discount_details.value.toFixed(2)} Fixed`)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{product.trade_offer_details || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
