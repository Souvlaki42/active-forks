import { GripVertical } from "lucide-react";
import { type ComponentPropsWithRef, forwardRef } from "react";
import type { DragHandleProps } from "react-querybuilder";

export type HandleProps = DragHandleProps & ComponentPropsWithRef<"span">;

// WARNING: This needs `forwardRef` to work properly for now
export const DragHandle = forwardRef<HTMLSpanElement, HandleProps>(
  ({ className, title }, dragRef) => (
    <span ref={dragRef} className={className} title={title}>
      <GripVertical className="w-5 h-5 text-input" />
    </span>
  ),
);
