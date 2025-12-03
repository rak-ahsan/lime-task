export default function ProductsTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Search + Create Row */}
      <div className="flex justify-between">
        <div className="h-10 w-56 bg-muted rounded-md" />
        <div className="h-10 w-36 bg-muted rounded-md" />
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="p-3 text-left">
                  <div className="h-4 w-24 bg-muted rounded" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {/* Image cell */}
                <td className="p-3">
                  <div className="h-12 w-12 bg-muted rounded-md" />
                </td>

                {/* ID */}
                <td className="p-3">
                  <div className="h-4 w-12 bg-muted rounded" />
                </td>

                {/* Name */}
                <td className="p-3">
                  <div className="h-4 w-32 bg-muted rounded" />
                </td>

                {/* Price */}
                <td className="p-3">
                  <div className="h-4 w-16 bg-muted rounded" />
                </td>

                {/* Stock */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-10 bg-muted rounded" />
                    <div className="h-5 w-16 bg-muted rounded" />
                  </div>
                </td>

                {/* Min Stock */}
                <td className="p-3">
                  <div className="h-4 w-10 bg-muted rounded" />
                </td>

                {/* Discount */}
                <td className="p-3">
                  <div className="h-4 w-16 bg-muted rounded" />
                </td>

                {/* Trade Offer */}
                <td className="p-3">
                  <div className="h-4 w-24 bg-muted rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4">
        <div className="h-10 w-28 bg-muted rounded-md" />
        <div className="h-10 w-28 bg-muted rounded-md" />
      </div>
    </div>
  );
}
