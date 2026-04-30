'use client';

import React from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getOneTestOptions } from '../hooks/queries/test-queries.options';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface TestDetailModalProps {
  id: number;
}

export default function TestDetailModal({ id }: TestDetailModalProps) {
  const { data: test } = useSuspenseQuery(getOneTestOptions(id));

  return (
    <DialogContent className="mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{test.name}</DialogTitle>
          <Badge variant="outline" className="capitalize">
            {test.resultValueType}
          </Badge>
        </div>
        <DialogDescription>
          Detailed information for test ID: {test.id}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Department
            </h4>
            <p className="mt-1 font-semibold">
              {test.department?.name || 'N/A'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Test Unit
            </h4>
            <p className="mt-1 font-semibold">{test.testUnit?.name || 'N/A'}</p>
          </div>
        </div>

        <hr />

        {/* Reference Ranges */}
        <div>
          <h4 className="mb-3 text-lg font-semibold">Reference Ranges</h4>
          {test.referenceRanges && test.referenceRanges.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age Range</TableHead>
                    <TableHead>Normal Range</TableHead>
                    <TableHead>Critical Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {test.referenceRanges.map((range) => (
                    <TableRow key={range.id}>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {range.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {range.age_min_years} - {range.age_max_years} yrs
                      </TableCell>
                      <TableCell>
                        {range.normal_min} - {range.normal_max}
                      </TableCell>
                      <TableCell>
                        {range.critical_min} - {range.critical_max}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No reference ranges defined.
            </p>
          )}
        </div>

        {/* Result Value Options (for Categorical tests) */}
        {test.resultValueType === 'Categorical' && (
          <div>
            <h4 className="mb-3 text-lg font-semibold">Result Options</h4>
            {test.resultValueOptions && test.resultValueOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {test.resultValueOptions
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((option) => (
                    <Badge
                      key={option.id}
                      variant={option.isDefault ? 'default' : 'secondary'}
                    >
                      {option.name}
                      {option.isDefault && ' (Default)'}
                    </Badge>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No result options defined.
              </p>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  );
}
