import Link from "next/link";
import { CheckIcon } from "@/components/polar/CheckIcon";
import { polarApi } from "@/lib/polar";

export default async function ProductsPage() {
  const { result } = await polarApi.products.list({
    isArchived: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-y-32">
        <h1 className="text-5xl font-bold text-center">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {result.items.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-y-6 justify-between p-6 rounded-2xl bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex flex-col gap-y-4">
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
                <div>
                  {product.benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="flex flex-row gap-x-2 items-center mb-2"
                    >
                      <CheckIcon className="text-green-500" />
                      <span className="text-sm">{benefit.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-x-4 justify-between items-center">
                <Link
                  className="h-10 flex flex-row items-center justify-center rounded-lg bg-blue-600 text-white font-medium px-6 hover:bg-blue-700 transition-colors"
                  href={`/checkout?products=${product.id}`}
                >
                  Buy Now
                </Link>
                <span className="text-gray-500 dark:text-gray-400 font-medium">
                  {product.prices[0].amountType === "fixed"
                    ? `$${product.prices[0].priceAmount / 100}`
                    : product.prices[0].amountType === "free"
                      ? "Free"
                      : "Pay what you want"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
