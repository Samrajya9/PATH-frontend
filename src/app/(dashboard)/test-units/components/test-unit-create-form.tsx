'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { createTestUnitOptions } from '../hooks/queries/test-unit-queries-options';
import useTestUnitForm from '../hooks/use-test-unit-form';
import TestUnitFormFields from './test-unit-form-fields';
import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDialogContext } from '@/hooks/use-dailog';

export default function TestUnitCreateForm() {
  const form = useTestUnitForm();
  const queryClient = useQueryClient();
  const { closeModal } = useDialogContext();

  const { mutate, isPending } = useMutation(
    createTestUnitOptions({
      queryClient,
      options: {
        onSuccess: (response) => {
          form.reset();
          toast.success(response.message || 'Test unit created successfully');
          closeModal(MODAL_REGISTRY.CREATE_TEST_UNIT_MODAL_ID);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to create test unit');
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
      <form
        id="form-create-test-unit"
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <FieldGroup>
          <TestUnitFormFields />
        </FieldGroup>
        <div className="flex items-center justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal(MODAL_REGISTRY.CREATE_TEST_UNIT_MODAL_ID)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
