import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const ProductVelocity = ({
  velocities,
  width,
}: {
  velocities: {
    days: number;
    velocity: number;
  }[];
  width: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            style={{ width: width }}
            className={`  font-medium text-left h-fit overflow-y-hidden whitespace-normal`}
          >
            <div className="relative flex w-full h-full items-center justify-between text-center">
              <div className="h-8 gap-2 flex items-center justify-between mr-2"></div>
              <span
                className="overflow-hidden whitespace-nowrap text-ellipsis block"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  width: "100%",
                }}
              >
                {/* {velocities.map((velocity) => `${velocity} days, `)} */}
                {`${velocities[3].velocity}`}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="relative z-[1000]">
          {/* <p>{velocities[0]}</p> */}
          <ul>
            {velocities.map((velocity, i) => (
              <li key={i}>{`${velocity.days}:  
                ${velocity.velocity}`}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductVelocity;
