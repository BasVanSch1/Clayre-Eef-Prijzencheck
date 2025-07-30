import { useState } from "react";
import { Form, useNavigate } from "react-router";

interface LookupCardProps {
  cardTitle: string;
  inputPlaceholder: string;
  buttonText: string;
  type: "ean" | "productcode";
  autoFocus?: boolean;
}

const LookupCard = ({
  cardTitle,
  inputPlaceholder,
  buttonText,
  type,
  autoFocus = false,
}: LookupCardProps) => {
  const navigate = useNavigate();
  const [lookupInput, setLookupInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let trimmedInput = lookupInput.trim();

    if (!trimmedInput) {
      navigate("/product");
      return;
    }

    const url =
      type === "ean"
        ? `/product/ean/${trimmedInput}`
        : `/product/${trimmedInput}`;

    navigate(url);
    resetInput();
  };

  function resetInput() {
    const inputElement = document.getElementById(
      `search-${type}`
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
      inputElement.focus();
    }
  }

  return (
    <>
      <div className="relative flex flex-col rounded-md border-1 border-gray-400/40 bg-white p-6 px-8 shadow-md grow gap-1 md:gap-3 dark:bg-neutral-700 dark:shadow dark:shadow-purple-600">
        <div className="text-center text-xl font-semibold dark:text-neutral-300">
          {cardTitle}
        </div>

        {/* Input field */}
        <Form onSubmit={handleSubmit}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <svg
                className="h-4 w-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <input
              type="text"
              id={`search-${type}`}
              placeholder={inputPlaceholder}
              onChange={(e) => setLookupInput(e.target.value)}
              className="block w-full rounded-lg border border-gray-400 bg-white p-4 ps-10 text-sm text-gray-900 focus:ring-0 focus:outline-none focus:border-[#0066ff] transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
              autoFocus={autoFocus}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-2 text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
          >
            {buttonText}
          </button>
        </Form>
      </div>
    </>
  );
};

export default LookupCard;
