import type { ComponentPropsWithoutRef } from "react";
import {
  useValueSelector,
  type VersatileSelectorProps,
} from "react-querybuilder";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { MultiSelect } from "./multiselect";
import { toSelectOptions } from "./utils";

export type Props = VersatileSelectorProps &
  ComponentPropsWithoutRef<typeof Select>;

export const ValueSelector = ({
  handleOnChange,
  options,
  value,
  title,
  disabled,
  // Props that should not be in extraProps
  testID: _testID,
  rule: _rule,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  operator: _operator,
  field: _field,
  fieldData: _fieldData,
  multiple: _multiple,
  listsAsArrays: _listsAsArrays,
  schema: _schema,
  ...extraProps
}: Props) => {
  const { val: selectedValue, onChange: handleValueChange } = useValueSelector({
    value,
    handleOnChange,
  });

  return _multiple ? (
    <MultiSelect
      options={options}
      value={selectedValue}
      onValueChange={handleValueChange}
    />
  ) : (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={handleOnChange}
      {...extraProps}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>{toSelectOptions(options)}</SelectContent>
    </Select>
  );
};
