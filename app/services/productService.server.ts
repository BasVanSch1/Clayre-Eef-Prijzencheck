import { endpoints } from "~/globals";

const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds (hour * min * sec * ms)
let lastFetchTime = 0;
let cachedProductCount: number | null = null;
let cachedProducts: any[] | null = null;

/**
 * Fetches the product count from the API, caching the result for the length of CACHE_DURATION.
 * If the cache is still valid, it returns the cached value.
 * If the API call fails, it returns -1 or the existing cache if available.
 */
export async function getProductCount(): Promise<number> {
  const currentTime = Date.now();

  if (!cachedProductCount || currentTime - lastFetchTime > CACHE_DURATION) {
    try {
      const res = await fetch(`${endpoints.products.count}`);

      if (!res.ok) {
        console.error(
          "Failed to fetch product count:",
          res.status,
          res.statusText
        );
        return cachedProductCount ?? -1;
      }

      const data = await res.json();
      cachedProductCount = data.productcount;
      lastFetchTime = currentTime;
      console.log(`Product count updated:`, cachedProductCount);
    } catch (error) {
      console.error("Failed to fetch product count:", error);
      return cachedProductCount ?? -1;
    }
  }

  return cachedProductCount ?? -1;
}

/**
 * Fetches products from the API, caching the result for the length of CACHE_DURATION.
 * If the cache is still valid, it returns the cached products.
 * If the API call fails, it returns an empty array or the cached products if available.
 */
export async function getProducts(): Promise<any[]> {
  const currentTime = Date.now();

  if (!cachedProducts || currentTime - lastFetchTime > CACHE_DURATION) {
    try {
      const res = await fetch(`${endpoints.products.get}`);

      if (!res.ok) {
        console.error("Failed to fetch products:", res.status, res.statusText);
        return cachedProducts ?? [];
      }

      const data = await res.json();
      cachedProducts = data;
      lastFetchTime = currentTime;
      console.log(`Products updated:`, cachedProducts?.length, "items");
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return cachedProducts ?? [];
    }
  }

  // console.log(`Retrieved`, cachedProducts?.length ?? 0, `products from cache`);
  return cachedProducts ?? [];
}
