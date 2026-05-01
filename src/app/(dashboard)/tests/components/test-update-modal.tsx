import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import UpdateTestForm from './update-test-form';
import { Test } from '@/types/tests';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getOneTestOptions } from '../hooks/queries/test-queries.options';

interface UpdateTestModalProps {
  id: number;
}
const TestUpdateModal = ({ id }: UpdateTestModalProps) => {
  const { data: test } = useSuspenseQuery(getOneTestOptions(id));

  return (
    <DialogContent className="mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Test</DialogTitle>
        <DialogDescription>
          Define a new diagnostic test with its reference ranges and result
          configuration.
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <UpdateTestForm id={id} data={test} />
      </div>
    </DialogContent>
  );
};

export default TestUpdateModal;
