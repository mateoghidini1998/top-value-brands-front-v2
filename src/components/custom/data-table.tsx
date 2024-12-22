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
import { PaginationComponent } from "./data-table-pagination";
import { Input } from "../ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dataLength?: number;
  pagination?: React.ReactElement;
  onSort?: (sorting: SortingState) => unknown;
  showHideColumns?: boolean;
  searchInput?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataLength = 10,
  pagination,
  onSort,
  showHideColumns = false,
  searchInput = "",
}: // setTableData,
DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    },
    manualSorting: onSort ? true : false,
  });

  useEffect(() => {
    if (onSort && sorting.length > 0) {
      const fetchSortedData = async () => {
        return await onSort(sorting);
      };
      fetchSortedData();
    }
  }, [sorting]);

  return (
    <div className="w-full">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {/* <SlidersHorizontal /> */}
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.split("_").join(" ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-xs" key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-xs" key={cell.id}>
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
                <TableCell colSpan={columns.length} className="h-24 text-xs">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination ? (
        pagination
      ) : data.length > dataLength ? (
        <PaginationComponent table={table} />
      ) : null}
    </div>
  );
}
