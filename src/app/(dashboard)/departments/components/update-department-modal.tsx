import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UpdateDepartmentForm } from './update-department-form';
import { Department } from '@/types/departments';

export default function UpdateDepartmentModal({
  data,
  id,
}: {
  data: Department;
  id: number;
}) {
  return (
    <DialogContent className="mx-2 max-w-[95vw] p-4 sm:mx-4 sm:max-w-[90vw] sm:p-6 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
          Add New Department
        </DialogTitle>
        <DialogDescription className="text-left text-sm sm:text-base">
          Update Department {data.name}
        </DialogDescription>
      </DialogHeader>
      <UpdateDepartmentForm id={id} data={data} />
    </DialogContent>
  );
}
