"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { usePersistedColumnsVisibility } from "@/hooks/usePersistedColsVisibility";

export interface ShowHideColsumnsProps {
  show: boolean;
  styles: string;
  tableId: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dataLength?: number;
  onSort?: (sorting: SortingState) => unknown;
  showHideColumns?: ShowHideColsumnsProps;
  searchInput?: string;
  scrolleable?: boolean;
  goToPath?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataLength = 10,
  onSort,
  showHideColumns = {
    show: false,
    styles: "",
    tableId: "",
  },
  searchInput = "",
  scrolleable = false,
  goToPath,
}: // setTableData,
DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { state } = useSidebar();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: data.length,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: dataLength,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualSorting: onSort ? true : false,
  });

  const handleVisibilityChange = usePersistedColumnsVisibility(
    table,
    showHideColumns.tableId
  );

  useEffect(() => {
    if (onSort && sorting.length > 0) {
      const fetchSortedData = async () => {
        return await onSort(sorting);
      };
      fetchSortedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-end pb-2">
        {searchInput !== "" && (
          <Input
            placeholder="Filter by Pallet Number..."
            value={
              (table.getColumn(searchInput)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchInput)?.setFilterValue(event.target.value)
            }
            className="mb-4 w-80"
          />
        )}
        {showHideColumns && (
          <div className={`${showHideColumns.styles}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2 className="h-[16px] w-[16px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onSelect={(event) => event.preventDefault()} // Evita que se cierre el menú
                        onCheckedChange={(value) => {
                          column.toggleVisibility(!!value);
                          handleVisibilityChange(column.id, !!value);
                        }}
                      >
                        {column.id.split("_").join(" ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <ScrollArea
        className={
          scrolleable ? "w-fit rounded-md border" : "w-full rounded-md border"
        }
      >
        <div
          data-state={state}
          className={
            !scrolleable
              ? "w-full"
              : "shrink-0 items-center gap-2 transition-[width,height] ease-linear data-[state=expanded]:w-[calc(98vw_-_var(--sidebar-width))] data-[state=collapsed]:w-[calc(98vw_-_var(--sidebar-width-icon))]"
          }
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="whitespace-nowrap text-center dark:bg-table_header root:bg-[#F8FAFC]"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={(e) => {
                      // Only navigate if goToPath is provided and the click target is not inside an action cell
                      if (goToPath && !e.defaultPrevented) {
                        // @ts-expect-error Property 'id' does not exist on type 'TData'
                        router.push(`${goToPath}/${row.original.id}`);
                      }
                    }}
                    className={`cursor-pointer ${
                      // @ts-expect-error Property 'dg_item' does not exist on type 'TData'
                      data[row.index].dg_item &&
                      // @ts-expect-error Property 'dg_item' does not exist on type 'TData'
                      data[row.index].dg_item !== "--"
                        ? "border border-solid-1 bg-red-500/10  dark:hover:text-white"
                        : "hover:bg-accent"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="whitespace-nowrap text-center"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 ">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
