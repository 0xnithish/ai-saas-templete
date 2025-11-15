import Link from "next/link";
import { CheckIcon } from "@/components/polar/CheckIcon";
import { polarApi } from "@/lib/polar";

export default async function ProductsPage() {
  const { result } = await polarApi.products.list({
    isArchived: false,
  });

  // Ensure the specific product is included
  const targetProductId = "32cf4ffe-5b33-4ffa-b9f8-40adfdfc4b6d";
  const hasTargetProduct = result.items.some(product => product.id === targetProductId);
  
  // If the target product is not in the list, try to fetch it separately
  if (!hasTargetProduct) {
    try {
      const targetProduct = await polarApi.products.get({ id: targetProductId });
      result.items.unshift(targetProduct);
    } catch (error) {
      console.error("Could not fetch target product:", error);
    }
  }

  return (
    <div id="products" className="flex flex-col gap-12 px-(--container-padding-x) py-(--section-padding-y) text-center bg-muted/30">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="mb-0 text-balance font-semibold text-4xl md:text-5xl leading-[1.15] tracking-tighter text-foreground">
          Products
        </h1>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-xl text-muted-foreground leading-relaxed">
          Discover our range of products designed to meet your needs.
        </p>
        <div className="mt-8 grid w-full max-w-5xl gap-6 lg:grid-cols-3">
          {result.items.map((product) => (
            <div
              key={product.id}
              className="relative w-full flex flex-col rounded-xl overflow-hidden bg-card border border-border shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)]"
            >
              {/* Header */}
              <div className="px-6 pt-4 pb-2 bg-card">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-2xl font-bold tracking-tight text-left text-foreground">
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-left text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="px-6 py-2">
                <div className="flex flex-col items-start">
                  {product.prices[0].amountType === "fixed" ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tighter text-foreground">
                        ${product.prices[0].priceAmount / 100}
                      </span>
                      <span className="text-base text-muted-foreground">
                        one-time payment
                      </span>
                    </div>
                  ) : product.prices[0].amountType === "free" ? (
                    <div className="text-2xl font-semibold text-left text-foreground">
                      Free
                    </div>
                  ) : (
                    <div className="text-2xl font-semibold text-left text-foreground">
                      Pay what you want
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <div className="px-6 py-3 bg-card">
                <Link
                  className="w-full py-4 rounded-md text-base font-semibold transition-all duration-200 items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 flex justify-center"
                  href={`/checkout?products=${product.id}`}
                >
                  Buy Now
                </Link>
              </div>

              {/* Features List */}
              <div className="px-6 py-4 flex-1 bg-muted/30">
                <div className="space-y-2">
                  {product.benefits.map((benefit) => (
                    <div key={benefit.id} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-sm leading-relaxed text-foreground">
                        {benefit.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
