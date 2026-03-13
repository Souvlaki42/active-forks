import { Fragment } from "react/jsx-runtime";
import type { OptionList } from "react-querybuilder";
import { isOptionGroupArray } from "react-querybuilder";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

type MultiSelectValue = string | string[];

export type MultiSelectProps = {
  options?: OptionList;
  value?: MultiSelectValue;
  onValueChange: (value: MultiSelectValue) => void;
};

export function MultiSelect({
  options = [],
  value,
  onValueChange,
}: MultiSelectProps) {
  const isMultiSelect = Array.isArray(value);
  const currentValue = !value ? [] : isMultiSelect ? value : [value];

  const toDropdownOptions = (list: OptionList) =>
    isOptionGroupArray(list)
      ? list.map((og) => (
          <Fragment key={og.label}>
            <DropdownMenuLabel>{og.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {og.options.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.name}
                disabled={!!opt.disabled}
                checked={currentValue.includes(opt.name ?? "")}
                onCheckedChange={(checked) => {
                  onValueChange(
                    checked
                      ? [...currentValue, opt.name ?? ""]
                      : currentValue.filter((v) => v !== opt.name),
                  );
                }}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </Fragment>
        ))
      : Array.isArray(list)
        ? list.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.name}
              disabled={!!opt.disabled}
              checked={currentValue.includes(opt.name)}
              onCheckedChange={(checked) => {
                onValueChange(
                  checked
                    ? [...currentValue, opt.name]
                    : currentValue.filter((v) => v !== opt.name),
                );
              }}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))
        : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex space-x-1", currentValue.length > 0 && "px-1")}
        >
          {[...currentValue].slice(0, 2).map((it) => (
            <div key={it} className="bg-accent px-3 py-1 rounded-sm text-sm">
              {it}
            </div>
          ))}
          {currentValue.length > 2 && (
            <div className="bg-accent px-3 py-1 rounded-sm text-sm">
              +{currentValue.length - 2}
            </div>
          )}
          {currentValue.length === 0 && "Choose..."}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {toDropdownOptions(options)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
