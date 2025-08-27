"use client";

import * as React from "react";
import Link from "next/link";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";

interface ProcessRecord {
    _id: string;
    App: string;
    GradeLevel: string;
    ParticipantId: string;
    Created: string;
    Modified: string;
}

interface DataTableProps {
    data: ProcessRecord[];
}

export function DataTable({ data }: DataTableProps) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [pageSize, setPageSize] = React.useState(20);

    const columns = React.useMemo<ColumnDef<any>[]>(
        () => [
            { accessorKey: "_id", header: "ID" },
            { accessorKey: "StudentName", header: "Student Name" },
            { accessorKey: "GradeLevel", header: "Grade Level" },
            { accessorKey: "ParticipantId", header: "Participant" },
            { accessorKey: "Created", header: "Created" },

            {
                id: "actions",
                header: "Action",
                cell: ({ row }) => {
                    const id = row.original._id;
                    return (
                        <Link
                            href={`/form/${id}`}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            Open Form
                        </Link>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    React.useEffect(() => {
        table.setPageSize(pageSize);
    }, [pageSize]);

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="flex items-center gap-2">
                <input
                    className="border rounded p-2 w-full"
                    placeholder="Search..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="rounded-lg border shadow-md overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-b hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-2 text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span>
                        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                        {table.getPageCount()}
                    </span>
                    <select
                        className="border rounded p-1"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 50, 100].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
