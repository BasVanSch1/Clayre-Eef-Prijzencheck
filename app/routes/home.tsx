import { NavLink } from "react-router";
import type { Route } from "./+types/home";
import LookupCard from "~/components/LookupCard";

export const handle = {
  title: "Home",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prijzencheck" },
    { name: "description", content: "Prijzencheck homepage" },
  ];
}

export default function Home() {
  return (
    <div className="col-start-3 row-start-3 flex flex-col mt-5">
      <div className="text-center text-black dark:text-neutral-300">
        <h1 className="mt-2 md:my-5 text-4xl font-semibold">Product Prijzen</h1>

        <p className="max-w-200 md:my-5">
          Op deze website kun je gemakkelijk producten opzoeken. Er zijn drie
          methodes om een product op te zoeken; je scant een <b>ean-code</b>, je
          vult een <b>productcode</b> in of je zoekt het product in de{" "}
          <NavLink to="products" className="text-blue-500">
            productlijst
          </NavLink>
        </p>
      </div>

      <hr className="my-2 hidden h-px border-0 bg-gray-400/40 md:block" />

      {/* Lookup fields */}
      <div className="flex flex-col gap-1 md:gap-0 md:flex-row mt-2 md:mt-0">
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
