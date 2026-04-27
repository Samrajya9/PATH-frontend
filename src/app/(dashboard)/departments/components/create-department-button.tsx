'use client';

import { Button } from '@/components/ui/button';
import { useDialogContext } from '@/hooks/use-dailog';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import DepartmentCreateForm from './department-create-form';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';

export default function CreateDepartmentButton() {
  const { openModal } = useDialogContext();
  return (
    <Button
      onClick={() =>
        openModal(
          MODAL_REGISTRY.CREATE_DEPARTMENT_MODAL_ID,
          <DialogContent className="mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                Add New Department
              </DialogTitle>
              <DialogDescription className="text-left text-sm sm:text-base">
                Create a new department to organize your system.
              </DialogDescription>
            </DialogHeader>
            <DepartmentCreateForm />
          </DialogContent>
        )
      }
    >
      <Plus className="size-4" />
      <span>Add Department</span>
    </Button>
  );
}
