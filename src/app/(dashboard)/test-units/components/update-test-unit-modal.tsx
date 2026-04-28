'use client';

import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import UpdateTestUnitForm from './update-test-unit-form';
import { TestUnit } from '@/types/test-unit';

interface UpdateTestUnitModalProps {
  id: number;
  data: TestUnit;
}

export default function UpdateTestUnitModal({
  id,
  data,
}: UpdateTestUnitModalProps) {
  return (
    <DialogContent className="mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Update Test Unit</DialogTitle>
        <DialogDescription>Editing: {data.name}</DialogDescription>
      </DialogHeader>
      <UpdateTestUnitForm id={id} data={data} />
    </DialogContent>
  );
}
