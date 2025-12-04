// app/users/page.tsx
// Next.js 15+ Server Component with caching and pagination

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: {
    name: string;
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const ITEMS_PER_PAGE = 5;

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { 
      revalidate: 3600 // Cache for 1 hour
    }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return res.json();
}

export default async function UsersPage(props: PageProps) {
  // In Next.js 15+, searchParams is a Promise
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const users = await getUsers();
  
  // Calculate pagination
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, endIndex);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Users Directory
        </h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>
            <span className="font-semibold">Cache:</span> 1 hour
          </span>
          <span>
            <span className="font-semibold">Page:</span> {currentPage}/{totalPages}
          </span>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.company.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
          <span className="font-medium">{Math.min(endIndex, users.length)}</span> of{' '}
          <span className="font-medium">{users.length}</span> results
        </div>
        
        <nav className="flex gap-2" aria-label="Pagination">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <a
              href={`?page=${currentPage - 1}`}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Previous page"
            >
              ← Previous
            </a>
          ) : (
            <span className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
              ← Previous
            </span>
          )}
          
          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`?page=${page}`}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </a>
            ))}
          </div>
          
          {/* Next Button */}
          {currentPage < totalPages ? (
            <a
              href={`?page=${currentPage + 1}`}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="Next page"
            >
              Next →
            </a>
          ) : (
            <span className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
              Next →
            </span>
          )}
        </nav>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>⚡ Cached for 1 hour using Next.js 15+ App Router</p>
        <p>💡 Data fetched from JSONPlaceholder API</p>
      </div>
    </div>
  );
}