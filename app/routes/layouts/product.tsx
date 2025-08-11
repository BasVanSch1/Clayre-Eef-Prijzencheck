import { Outlet } from "react-router";
import LookupCard from "~/components/LookupCard";

export default function ProductLayout() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5 gap-y-1">
      <Outlet />

      <hr className="my-1 hidden h-px border-0 bg-gray-400/40 md:block" />

      {/* Lookup field */}
      <div>
        <LookupCard
          cardTitle="Zoek een product"
          inputPlaceholder="Voer EAN/Product code in"
          buttonText="Zoeken"
          id="lookup-product"
          autoFocus={true}
          className="md:m-auto"
        />
      </div>
    </div>
  );
}
