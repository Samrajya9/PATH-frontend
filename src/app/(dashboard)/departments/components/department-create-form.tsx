'use client';

import { FormProvider } from 'react-hook-form';
import useDepartmentForm from '../hooks/use-department-form';
import DepartmentFormFields from './department-form-fields';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createDepartmentOptions } from '../hooks/queries/department-queries-options';
import { toast } from 'sonner';
import { useDialogContext } from '@/hooks/use-dailog';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { Field, FieldGroup } from '@/components/ui/field';

const DepartmentCreateForm = () => {
  const queryClient = getQueryClient();
  const form = useDepartmentForm();
  const { mutateAsync: createDepartment, isPending } = useMutation(
    createDepartmentOptions({
      queryClient,
      options: {
        onSuccess: (data) => {
          form.reset();
          toast.success(data.message);
          closeModal(MODAL_REGISTRY.CREATE_DEPARTMENT_MODAL_ID);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    })
  );
  const { closeModal } = useDialogContext();

  const onSubmit = form.handleSubmit(async (data) => {
    await createDepartment(data);
  });

  const isLoading = form.formState.isSubmitting || isPending;
  return (
    <FormProvider {...form}>
      <form id="form-create-department" onSubmit={onSubmit}>
        <FieldGroup>
          <DepartmentFormFields />
          <Field orientation="horizontal">
            <Button type="button" variant="outline">
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Department'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};

export default DepartmentCreateForm;
