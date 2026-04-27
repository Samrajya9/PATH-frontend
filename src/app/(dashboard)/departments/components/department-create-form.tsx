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

const DepartmentCreateForm = () => {
  const queryClient = getQueryClient();
  const form = useDepartmentForm({});
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
          form.reset();
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
        <DepartmentFormFields />
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:gap-3 sm:pt-4">
          <Button type="button" variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Department'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DepartmentCreateForm;
