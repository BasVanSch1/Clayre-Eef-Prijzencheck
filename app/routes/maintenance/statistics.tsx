import { ProductIcon, SearchIcon, UserIcon } from "~/components/Icons";
import { useLoaderData } from "react-router";
import type { Statistics } from "~/components/Types";
import { getStatistics } from "~/services/statistics.server";
import type { Route } from "./+types/statistics";

export const handle = {
  title: "Maintenance > Statistics",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck - Maintenance" },
    { name: "description", content: "Prijzencheck Maintenance" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const statistics = await getStatistics();

  return { statistics };
}

export default function Statistics() {
  const statistics = useLoaderData().statistics as Statistics;

  return (
    <>
      <div className="row-start-2 md:col-start-2 md:row-start-1 grid grid-cols-3 grid-rows-3 gap-y-2 gap-x-2">
        {/* Statistic Panels row 1*/}
        <div className="col-start-1 row-start-1 grid-col-flex flex-col bg-gradient-to-t from-blue-300/80 from-5% via-blue-300 to-blue-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-blue-400/60 mt-2 p-2 shadow">
            <ProductIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Products
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.totalProducts}
          </p>
        </div>

        <div className="col-start-2 row-start-1 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Lookups
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.totalLookups}
          </p>
        </div>

        <div className="col-start-3 row-start-1 flex flex-col bg-gradient-to-t from-amber-200/80 from-5% via-amber-200 to-amber-200/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-amber-400/60 mt-2 p-2 shadow">
            <UserIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              Users
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.totalUsers}
          </p>
        </div>

        {/* Statistic Panels row 2*/}
        <div className="col-start-2 row-start-2 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              By EAN
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.lookupsByEAN}
          </p>
        </div>

        {/* Statistic Panels row 3*/}
        <div className="col-start-2 row-start-3 flex flex-col bg-gradient-to-t from-teal-300/80 from-5% via-teal-300 to-teal-300/80 to-95% rounded-xl shadow-md w-full md:flex-grow">
          <div className="flex flex-col items-center justify-center border-b-1 border-teal-400/60 mt-2 p-2 shadow">
            <SearchIcon width="40" height="40" />
            <h2 className="text-gray-700 text-lg font-semibold text-center">
              By code
            </h2>
          </div>
          <p className="text-gray-600 text-2xl text-center p-2">
            {statistics.lookupsByCode}
          </p>
        </div>
      </div>
    </>
  );
}
