import type { ComponentPropsWithoutRef } from "react";
import type { NotToggleProps as ReactQueryBuilderNotToggleProps } from "react-querybuilder";
import { Switch } from "~/components/ui/switch";

export type NotToggleProps = ReactQueryBuilderNotToggleProps &
  ComponentPropsWithoutRef<typeof Switch>;

export const NotToggle = ({
  className,
  handleOnChange,
  checked,
  disabled,
  label,
}: NotToggleProps) => {
  return (
    <div className="flex space-x-2 text-sm items-center">
      <Switch
        className={className}
        disabled={disabled}
        checked={checked}
        onCheckedChange={handleOnChange}
      />
      <span>{label}</span>
    </div>
  );
};
