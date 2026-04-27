'use client';
import { useState } from 'react';
import { clientHttp } from '@/lib/axios/client.axios';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import departmentQueryKeys from '../constants/department.queryKeys';
import { Department } from '@/types/departments';
import { Meta } from '@/types/data-response-meta';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllDepartmentsOptions } from '../hooks/queries/department-queries-options';
import { useDialogContext } from '@/hooks/use-dailog';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import UpdateDepartmentModal from './update-department-modal';
import { id } from 'zod/locales';

const DepartmentTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { openModal } = useDialogContext();

  const { data } = useSuspenseQuery(getAllDepartmentsOptions({ page, limit }));

  const departments = data?.departments ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [];
    const addPage = (p: number) => {
      if (!pages.includes(p)) pages.push(p);
    };
    addPage(1);
    if (page > 3) pages.push('ellipsis');
    for (
      let p = Math.max(2, page - 1);
      p <= Math.min(totalPages - 1, page + 1);
      p++
    )
      addPage(p);
    if (page < totalPages - 2) pages.push('ellipsis');
    addPage(totalPages);
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className={`overflow-hidden rounded-lg border border-border`}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-14 pl-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                ID
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Created At
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Updated At
              </TableHead>
              <TableHead className="w-12 pr-4 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No departments found.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept: Department) => (
                <TableRow
                  key={dept.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <TableCell className="pl-4 text-sm text-muted-foreground tabular-nums">
                    {dept.id}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {dept.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(dept.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(dept.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label={`Actions for ${dept.name}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => console.log('view', dept.id)}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="size-4 text-muted-foreground" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            openModal(
                              MODAL_REGISTRY.UPDATE_DEPARTMENT_MODAL_ID,
                              <UpdateDepartmentModal id={dept.id} data={dept} />
                            );
                          }}
                          className="cursor-pointer gap-2"
                        >
                          <Pencil className="size-4 text-muted-foreground" />
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => console.log('delete', dept.id)}
                          className="cursor-pointer gap-2"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'pointer-events-none opacity-40' : ''}
                />
              </PaginationItem>

              {getPageNumbers().map((p, idx) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(p as number);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? 'pointer-events-none opacity-40' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default DepartmentTable;
