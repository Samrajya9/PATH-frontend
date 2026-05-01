'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { updateTestOptions } from '../hooks/queries/test-queries.options';
import useTestForm from '../hooks/use-test-form';
import TestFormFields from './test-form-fields';
import { Button } from '@/components/ui/button';
import { useDialogContext } from '@/hooks/use-dailog';
import { Test } from '@/types/tests';

interface UpdateTestFormProps {
  id: number;
  data: Test;
}

export default function UpdateTestForm({ id, data }: UpdateTestFormProps) {
  const form = useTestForm({
    initialValue: {
      ...data,
      department_id: data.department.id,
      test_unit_id: data.testUnit.id,
    },
  });
  const queryClient = useQueryClient();
  const { closeModal } = useDialogContext();

  const { mutate, isPending } = useMutation(
    updateTestOptions({
      queryClient,
      options: {
        onSuccess: (response) => {
          form.reset();
          toast.success(response.message || 'Test updated successfully');
          closeModal(MODAL_REGISTRY.UPDATE_TEST_MODAL_ID);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update test');
        },
      },
    })
  );

  const onSubmit = form.handleSubmit((formData) => {
    mutate({ id, data: formData });
  });

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <FormProvider {...form}>
      <form id="form-update-test" onSubmit={onSubmit} className="space-y-6">
        <TestFormFields />

        <div className="flex items-center justify-end space-x-2 border-t pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal(MODAL_REGISTRY.UPDATE_TEST_MODAL_ID)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
