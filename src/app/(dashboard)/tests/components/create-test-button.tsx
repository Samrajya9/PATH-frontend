'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import TestCreateForm from './test-create-form';
import { useDialogContext } from '@/hooks/use-dailog';

export default function CreateTestButton() {
  const { openModal } = useDialogContext();

  return (
    <Button
      onClick={() =>
        openModal(
          MODAL_REGISTRY.CREATE_TEST_MODAL_ID,
          <DialogContent className="mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Test</DialogTitle>
              <DialogDescription>
                Define a new diagnostic test with its reference ranges and
                result configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <TestCreateForm />
            </div>
          </DialogContent>
        )
      }
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Test
    </Button>
  );
}
