import { endpoints } from "~/globals";

const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds (hour * min * sec * ms)
let lastFetchTime = 0;
let cachedProductCount: number | null = null;
let cachedProducts: any[] | null = null;

/**
 * Returns the total count of products from the API.
 * Uses a cache to avoid unnecessary API calls within the cache duration.
 * @returns {Promise<number>} The total number of products, or -1 if unavailable.
 */
export async function getProductCount(): Promise<number> {
  const currentTime = Date.now();

  if (
    cachedProductCount === null ||
    currentTime - lastFetchTime > CACHE_DURATION
  ) {
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
 * Retrieves all products as an array from the API.
 * Uses a cache to avoid unnecessary API calls within the cache duration.
 * @returns {Promise<any[]>} An array of product objects, or an empty array if unavailable.
 */
export async function getProducts(): Promise<any[]> {
  const currentTime = Date.now();

  if (!cachedProducts || currentTime - lastFetchTime > CACHE_DURATION) {
    try {
      const res = await fetch(`${endpoints.products.getAll}`);

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

  return cachedProducts ?? [];
}
