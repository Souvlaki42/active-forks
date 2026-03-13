import type { ComponentPropsWithoutRef } from "react";
import type { ActionWithRulesProps } from "react-querybuilder";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type ActionIconProps = ActionWithRulesProps &
  ComponentPropsWithoutRef<typeof Button>;

export const ActionElementIcon = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  // Props that should not be in extraProps
  testID: _testID,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  ruleOrGroup: _ruleOrGroup,
  schema: _schema,
  ...extraProps
}: ActionIconProps) => (
  <Button
    size="icon"
    variant="ghost"
    className={cn(className, "flex-none")}
    title={disabledTranslation && disabled ? disabledTranslation.title : title}
    onClick={(e) => handleOnClick(e)}
    disabled={disabled && !disabledTranslation}
    {...extraProps}
  >
    {disabledTranslation && disabled ? disabledTranslation.label : label}
  </Button>
);
