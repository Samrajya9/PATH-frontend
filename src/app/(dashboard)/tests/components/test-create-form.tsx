'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { createTestOptions } from '../hooks/queries/test-queries.options';
import useTestForm from '../hooks/use-test-form';
import TestFormFields from './test-form-fields';
import { Button } from '@/components/ui/button';
import { useDialogContext } from '@/hooks/use-dailog';

export default function TestCreateForm() {
  const form = useTestForm();
  const queryClient = useQueryClient();
  const { closeModal } = useDialogContext();

  const { mutate, isPending } = useMutation(
    createTestOptions({
      queryClient,
      options: {
        onSuccess: (response) => {
          form.reset();
          toast.success(response.message || 'Test created successfully');
          closeModal(MODAL_REGISTRY.CREATE_TEST_MODAL_ID);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to create test');
        },
      },
    })
  );

  const onSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <FormProvider {...form}>
      <form id="form-create-test" onSubmit={onSubmit} className="space-y-6">
        <TestFormFields />

        <div className="flex items-center justify-end space-x-2 border-t pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal(MODAL_REGISTRY.CREATE_TEST_MODAL_ID)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Test
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
