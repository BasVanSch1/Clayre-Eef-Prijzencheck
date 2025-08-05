import type { Product } from "./Types";

interface ProductCard {
  product: Product;
}

const ProductCard = ({ product }: ProductCard) => {
  return (
    <>
      <div className="flex flex-col rounded-md border-1 border-gray-400/40 bg-white dark:bg-neutral-700 p-6 shadow-md dark:shadow dark:shadow-purple-600 md:flex-row ">
        <div className="flex size-60 justify-center md:m-5">
          <img className="rounded-md" src={product.imageUrl} />
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
