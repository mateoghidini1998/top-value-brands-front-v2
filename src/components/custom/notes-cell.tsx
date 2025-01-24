import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const NotesCell = ({ notes, width }: { notes: string; width: string }) => {
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
                className=" limited-wrap"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  width: "100%",
                }}
              >
                {notes}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{notes}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotesCell;
