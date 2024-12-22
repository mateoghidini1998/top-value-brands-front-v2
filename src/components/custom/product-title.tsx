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
  // product: Product;
  product_name: string;
  product_image: string;
  ASIN: string;
  in_seller_account: boolean;
  width: number;
};

export function ProductTitle({
  product_name,
  product_image,
  ASIN,
  in_seller_account,
  width,
}: ProductNameTableDataProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            style={{ width: width }}
            className={` text-xs font-medium text-left h-[35px] overflow-y-hidden`}
          >
            <div className="relative flex w-full h-full items-center justify-between text-left">
              <div className="h-8 gap-2 flex items-center justify-between mr-2">
                {product_image ? (
                  <div className="">
                    <Link
                      target="a_blank"
                      href={`https://www.amazon.com/dp/${ASIN}`}
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
                  <div className="h-8 bg-light-2 shadow-sm dark:bg-dark-2 rounded-lg flex items-center justify-center">
                    <EmptyImage />
                  </div>
                )}
                {in_seller_account !== undefined && (
                  <div
                    className={`w-[8px] h-[8px] rounded-full ${
                      in_seller_account ? "bg-[#00952A]" : "bg-[#ef4444]"
                    }`}
                  ></div>
                )}
              </div>
              <span
                className="text-xs limited-wrap"
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
