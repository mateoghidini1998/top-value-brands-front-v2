import { useEffect } from "react";
import { Button } from "../ui/button";

export default function FetchError({
  error,
  reset,
}: {
  error: string | undefined;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        We apologize for the inconvenience. Please try again later.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
