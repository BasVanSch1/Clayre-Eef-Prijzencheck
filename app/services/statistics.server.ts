import type { Statistics } from "~/components/Types";
import { endpoints } from "~/globals";

/**
 * Fetches statistics from the API.
 * Uses fallback data in case of an error or if the API is unavailable.
 * @param {string} [username] - Optional username for personalized statistics
 * @returns {Promise<Statistics>} The statistics data
 */
export async function getStatistics(username?: string): Promise<Statistics> {
  // Fallback statistics in case of an error or if the API is unavailable
  const fallbackStatistics: Statistics = {
    id: "Fallback",
    name: "Fallback Statistics",
    lookupsByEAN: -1,
    lookupsByCode: -1,
    totalLookups: -1,
    totalProducts: -1,
    totalUsers: -1,
  };

  try {
    const res = await fetch(
      `${endpoints.statistics.get}`.replace("{id}", username ?? "prijzencheck")
    );

    if (!res.ok) {
      console.error("Failed to fetch statistics:", res.status, res.statusText);

      return fallbackStatistics;
    }

    const data = await res.json();
    const stats: Statistics = {
      id: data.id,
      name: data.name,
      lookupsByEAN: data.lookupsByEAN,
      lookupsByCode: data.lookupsByCode,
      totalLookups: data.totalLookups,
      totalProducts: data.totalProducts,
      totalUsers: data.totalUsers,
    };

    return stats;
  } catch (error) {
    console.error("Failed to fetch statistics:", error);

    return fallbackStatistics;
  }
}
