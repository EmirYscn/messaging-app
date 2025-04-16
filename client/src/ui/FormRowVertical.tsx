import { AxiosError } from "axios";
import { isValidElement } from "react";

type FormRowProps = {
  label?: string;
  apiError?: string | AxiosError;
  formError?: string;
  children: React.ReactNode;
};

function FormRowVertical({ label, formError, children }: FormRowProps) {
  const childElement = isValidElement<{ id?: string }>(children)
    ? children
    : null;
  const childId = childElement?.props?.id;

  return (
    <div className="flex flex-col gap-2 py-3">
      {label && (
        <label htmlFor={childId} className="font-medium">
          {label}
        </label>
      )}
      {children}
      {formError && (
        <span className="text-sm text-[var(--color-red-700)] text-right col-span-full">
          {formError}
        </span>
      )}
    </div>
  );
}

export default FormRowVertical;
