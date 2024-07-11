import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Button } from "../../ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../../ui/pagination"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select"
import { useState } from "react"
import { Input } from "../../ui/input"

type Props = {
    columns: ColumnDef<unknown, any>[],
    data: any[],
    pagination: PaginationState,
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>,
    meta: {
        total: number,
        page: number,
        limit: number
    },
    searchable?: {
        field: string
    }
}

const DataTableComponent = ({columns,data, pagination, setPagination, meta, searchable}: Props) => {

    const [sorting, setSorting] = useState<SortingState>([])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: data ?? [],
        columns: columns,
        rowCount: meta.total ?? -1,
        state: {
            pagination,
            sorting,
            columnFilters,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        // debugAll: true
    })

    return (
        <div>
            {
                searchable && (
                    <div className="flex items-center py-4">
                        <Input
                            placeholder={`Filter ${searchable.field}...`}
                            value={(table.getColumn(searchable.field)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchable.field)?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                )
            }
            <div className="rounded-md border bg-white overflow-x-auto max-w-5xl">
                <Table className="">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-100 rounded-md hover:bg-gray-100">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-gray-800">
                                            {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                    className="even:bg-gray-50 hover:bg-white even:hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} Rows
                </div>
                <div className="space-x-2 flex items-center">
                    <Select 
                        onValueChange={(val) => table.setPageSize(Number(val))} 
                        defaultValue={table.getState().pagination.pageSize.toString()}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {[5, 10, 20, 30, 40, 50].map(pageSize => (
                                    <SelectItem 
                                        key={pageSize}
                                        value={pageSize.toString()}>Show {pageSize}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <span className="text-sm text-gray-600 flex gap-1 mr-4">
                                    <span>Page</span>
                                    <span>
                                        {table.getState().pagination.pageIndex + 1} of{' '}
                                        {table.getPageCount().toLocaleString()}
                                    </span>
                                </span>
                            </PaginationItem>
                            <PaginationItem>
                                <Button 
                                    variant={'outline'}
                                    size={"icon"}
                                    onClick={() => table.firstPage()} 
                                    disabled={!table.getCanPreviousPage()}
                                ><MdKeyboardDoubleArrowLeft className="text-lg" /></Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button 
                                    variant={'outline'}
                                    size={"icon"}
                                    onClick={() => table.previousPage()} 
                                    disabled={!table.getCanPreviousPage()}
                                ><MdKeyboardArrowLeft className="text-lg" /></Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button 
                                    variant={'outline'}
                                    size={"icon"}
                                    onClick={() => table.nextPage()} 
                                    disabled={!table.getCanNextPage()}
                                ><MdKeyboardArrowRight className="text-lg" /></Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button 
                                    variant={'outline'}
                                    size={"icon"}
                                    onClick={() => table.lastPage()} 
                                    disabled={!table.getCanNextPage()}
                                ><MdKeyboardDoubleArrowRight className="text-lg" /></Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default DataTableComponent