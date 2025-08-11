import { DownloadIcon } from "./Icons";
import type { Product } from "./Types";

interface ProductCard {
  product: Product;
}

const ProductCard = ({ product }: ProductCard) => {
  function handleDownloadProductPhoto(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    console.log(`Downloading photo for product: ${product.productCode}`);

    window.open(`/data/${product.productCode}?product=true`, "_blank");
  }

  return (
    <>
      <div className="flex flex-col rounded-md border-1 border-gray-400/40 bg-white dark:bg-neutral-700 p-6 shadow-md dark:shadow dark:shadow-purple-600 md:flex-row ">
        <div className="relative flex size-60 justify-center md:m-5">
          <img className="rounded-md" src={product.imageUrl} />
          <button
            onClick={handleDownloadProductPhoto}
            className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#007bffbd] hover:bg-[#0066ff] p-1 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
          >
            <DownloadIcon className="size-5" />
          </button>
        </div>

        <div className="m-5 hidden h-auto w-px bg-gray-400/40 md:block"></div>
        <hr className="my-2 h-px border-0 bg-gray-400/40 md:hidden" />

        <div className="flex flex-col justify-center text-center md:text-left md:mr-25 md:ml-5 md:gap-2">
          <p className="text-3xl font-semibold text-black dark:text-neutral-300">
            {product.productCode}
          </p>
          <p className="text-lg text-gray-600 dark:text-neutral-400">
            {product.description}
          </p>
          <p className="text-2xl text-black dark:text-neutral-300">
            <b>Prijs:</b> € {product.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-lg text-black dark:text-neutral-300">
            <b>EAN code:</b> {product.eanCode}
          </p>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
