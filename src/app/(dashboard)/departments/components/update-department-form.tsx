'use client';

import { getQueryClient } from '@/lib/query-client';
import useDepartmentForm from '../hooks/use-department-form';
import { Department } from '@/types/departments';
import { updateDepartmentOptions } from '../hooks/queries/department-queries-options';
import { useMutation } from '@tanstack/react-query';
import { FormProvider } from 'react-hook-form';
import DepartmentFormFields from './department-form-fields';
import { Button } from '@/components/ui/button';
import { MODAL_REGISTRY } from '@/constants/modal/modal-component-registry';
import { useDialogContext } from '@/hooks/use-dailog';
import { Field, FieldGroup } from '@/components/ui/field';

export const UpdateDepartmentForm = ({
  id,
  data,
}: {
  id: number;
  data: Department;
}) => {
  const queryClient = getQueryClient();
  const form = useDepartmentForm({ initialValue: { name: data.name } });
  const { closeModal } = useDialogContext();

  const { mutateAsync: updateDepartment, isPending } = useMutation(
    updateDepartmentOptions({
      queryClient,
      options: {
        onSuccess: () => {
          form.reset();
          closeModal(MODAL_REGISTRY.UPDATE_DEPARTMENT_MODAL_ID);
        },
      },
    })
  );
  const onSubmit = form.handleSubmit(async (data) => {
    await updateDepartment({ id, data });
  });

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <FormProvider {...form}>
      <form id="form-update-department" onSubmit={onSubmit}>
        <FieldGroup>
          <DepartmentFormFields />
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                closeModal(MODAL_REGISTRY.UPDATE_DEPARTMENT_MODAL_ID);
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Department'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};
