"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  table: any;
};

export function PaginationComponent({ table }: Props) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const maxVisibleButtons = 5;

  // Calcular el rango de botones a mostrar
  const getPageRange = () => {
    const start = Math.max(
      0,
      Math.min(
        pageIndex - Math.floor(maxVisibleButtons / 2),
        pageCount - maxVisibleButtons
      )
    );
    const end = Math.min(pageCount, start + maxVisibleButtons);
    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  const pageRange = getPageRange();

  return (
    <Pagination>
      <PaginationContent>
        {/* Botón para ir a la página anterior */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (table.getCanPreviousPage()) {
                table.previousPage();
              }
            }}
            href={table.getCanPreviousPage() ? "#" : undefined}
            className={`h-9 w-9 p-0 ${!table.getCanPreviousPage() ? "cursor-not-allowed opacity-50" : ""}`}
          />
        </PaginationItem>

        {/* Mostrar botones de páginas dentro del rango calculado */}
        {pageRange.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={pageIndex === page}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Botón para ir a la página siguiente */}
        <PaginationItem>
          <PaginationNext
            href={table.getCanNextPage() ? "#" : undefined}
            onClick={() => {
              if (table.getCanNextPage()) {
                table.nextPage();
              }
            }}
            className={`h-9 w-9 p-0 ${!table.getCanNextPage() ? "cursor-not-allowed opacity-50" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
