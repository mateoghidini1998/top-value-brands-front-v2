/* eslint-disable @next/next/no-img-element */

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import EmptyImage from "./empty-image";

type ProductNameTableDataProps = {
  product_name: string;
  product_image: string;
  ASIN?: string;
  GTIN?: string;
  in_seller_account?: boolean;
  width: number;
};

export function ProductTitle({
  product_name,
  product_image,
  ASIN,
  GTIN,
  in_seller_account,
  width,
}: ProductNameTableDataProps) {
  const getProductUrl = () => {
    if (ASIN) {
      return `https://www.amazon.com/dp/${ASIN}`;
    }
    if (GTIN) {
      return `https://www.walmart.com/ip/${GTIN}`;
    }
    return "#";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            style={{ width: width }}
            className={`  font-medium text-left h-fit overflow-y-hidden whitespace-normal`}
          >
            <div className="relative flex w-full h-full items-center justify-between text-left">
              <div className="h-8 gap-2 flex items-center justify-between mr-2">
                {product_image ? (
                  <div className="w-7 h-7">
                    <Link
                      target="a_blank"
                      href={getProductUrl()}
                    >
                      <img
                        src={product_image}
                        alt="product_image"
                        loading="lazy"
                        className="cover rounded-xl w-7 h-7"
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </Link>
                  </div>
                ) : (
                  <div className="h-7 w-70 bg-light-2 shadow-sm dark:bg-dark-2 rounded-lg flex items-center justify-center">
                    <EmptyImage />
                  </div>
                )}
              </div>
              <span
                className=" limited-wrap"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  width: "80%",
                }}
              >
                {product_name}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{product_name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
