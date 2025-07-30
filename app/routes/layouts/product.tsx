import { Outlet } from "react-router";
import LookupCard from "~/components/LookupCard";

export default function ProductLayout() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <Outlet />

      <hr className="my-2 hidden h-px border-0 bg-gray-400/40 md:block" />

      {/* Lookup fields */}
      <div className="flex flex-col gap-1 md:flex-row mt-2 md:mt-0">
        <LookupCard
          cardTitle="Zoek op EAN"
          inputPlaceholder="Voer EAN code in"
          buttonText="Zoeken"
          type="ean"
          autoFocus={true}
        />

        <div className="m-2 hidden h-auto w-px bg-gray-400/40 md:block"></div>

        <LookupCard
          cardTitle="Zoek op Productcode"
          inputPlaceholder="Voer Productcode in"
          buttonText="Zoeken"
          type="productcode"
        />
      </div>
    </div>
  );
}
