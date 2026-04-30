'use client';

import { FormProvider } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { updateTestUnitOptions } from '../hooks/queries/test-unit-queries-options';
import useTestUnitForm from '../hooks/use-test-unit-form';
import TestUnitFormFields from './test-unit-form-fields';
import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { TestUnit } from '@/types/test-unit';
import { useDialogContext } from '@/hooks/use-dailog';

interface UpdateTestUnitFormProps {
  id: number;
  data: TestUnit;
}

export default function UpdateTestUnitForm({
  id,
  data,
}: UpdateTestUnitFormProps) {
  const form = useTestUnitForm({ initialValue: { ...data } });
  const queryClient = useQueryClient();
  const { closeModal } = useDialogContext();

  const { mutate, isPending } = useMutation(
    updateTestUnitOptions({
      queryClient,
      options: {
        onSuccess: (response) => {
          form.reset();
          toast.success(response.message || 'Test unit updated successfully');
          closeModal(MODAL_REGISTRY.UPDATE_TEST_UNIT_MODAL_ID);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to update test unit');
        },
      },
    })
  );

  const onSubmit = form.handleSubmit((formData) => {
    const dirtyFields = form.formState.dirtyFields;

    // Build payload with only changed fields
    const changedData = Object.keys(dirtyFields).reduce(
      (acc, key) => {
        const field = key as keyof typeof formData;
        if (dirtyFields[field]) {
          acc[field] = formData[field];
        }
        return acc;
      },
      {} as Partial<typeof formData>
    );

    // Nothing changed, skip the API call
    if (Object.keys(changedData).length === 0) {
      toast.success('Test unit updated successfully');
      closeModal(MODAL_REGISTRY.UPDATE_TEST_UNIT_MODAL_ID);
      return;
    }
    mutate({ id, data: changedData });
  });

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <FormProvider {...form}>
      <form
        id="form-update-test-unit"
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
            onClick={() => closeModal(MODAL_REGISTRY.UPDATE_TEST_UNIT_MODAL_ID)}
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
