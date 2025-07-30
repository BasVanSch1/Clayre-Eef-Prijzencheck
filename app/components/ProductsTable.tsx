import { useState } from "react";
import { useNavigate } from "react-router";

interface ProductsTableProps {
  data?: any[] | undefined | null;
}

const ProductsTable = ({ data }: ProductsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const thClassNames =
    "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500";
  const tdClassNames =
    "px-6 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200";

  const filteredData = data?.filter((product) => {
    const productCode = product.productCode.toLowerCase();
    const description = product.description.toLowerCase();
    const price = product.price.toFixed(2).replace(".", ",");

    return (
      productCode.includes(searchTerm) ||
      description.includes(searchTerm) ||
      price.includes(searchTerm)
    );
  });

  function navigateToProduct(productCode: string) {
    if (!productCode) {
      return;
    }

    navigate(`/product/${productCode}`);
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <input
          type="text"
          id="productsSearch"
          placeholder="Zoek een product..."
          className="block w-full rounded-lg border border-gray-400 bg-white p-1 ps-10 text-sm text-gray-900 focus:ring-0 focus:outline-none focus:border-[#0066ff] transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
          autoFocus={true}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      <table className="w-[60vw]">
        <thead>
          <tr>
            <th scope="col" className={thClassNames}>
              Product Code
            </th>
            <th scope="col" className={thClassNames}>
              Beschrijving
            </th>
            <th scope="col" className={thClassNames}>
              Prijs
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {!filteredData || filteredData.length <= 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-gray-500 dark:text-neutral-400"
              >
                No products available
              </td>
            </tr>
          ) : (
            filteredData.map((product: any) => (
              <tr
                key={product.productCode}
                className="hover:bg-gray-200 dark:hover:bg-neutral-800 cursor-pointer"
                onClick={() => navigateToProduct(product.productCode)}
              >
                <td className={tdClassNames}>{product.productCode}</td>
                <td className={tdClassNames}>{product.description}</td>
                <td className={tdClassNames}>
                  € {product.price.toFixed(2).replace(".", ",")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default ProductsTable;
