"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Lock,
  Plus,
  Unlock,
  X,
} from "lucide-react";
import type {
  Classnames,
  Controls,
  FullField,
  Translations as TranslationsType,
} from "react-querybuilder";
import { getCompatContextProvider } from "react-querybuilder";
import { ActionElement } from "./action-element";
import { ActionElementIcon } from "./action-element-icon";
import { DragHandle } from "./drag-handle";
import { NotToggle } from "./not-toggle";
import { ValueEditor } from "./value-editor";
import { ValueSelector } from "./value-selector";
import "./styles.css";

export * from "./action-element";
export * from "./value-selector";

export const ControlClassnames = {
  ruleGroup: "rounded-lg shadow-sm border bg-background",
} satisfies Partial<Classnames>;

export const ControlElements = {
  actionElement: ActionElement,
  removeGroupAction: ActionElementIcon,
  removeRuleAction: ActionElementIcon,
  valueSelector: ValueSelector,
  valueEditor: ValueEditor,
  notToggle: NotToggle,
  dragHandle: DragHandle,
} satisfies Partial<Controls<FullField, string>>;

export const Translations = {
  addRule: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Rule
      </>
    ),
  },
  addGroup: {
    label: (
      <>
        <Plus className="w-4 h-4 mr-2" /> Group
      </>
    ),
  },
  removeGroup: { label: <X className="w-4 h-4" /> },
  removeRule: { label: <X className="w-4 h-4" /> },
  cloneRuleGroup: { label: <Copy className="w-4 h-4" /> },
  cloneRule: { label: <Copy className="w-4 h-4" /> },
  lockGroup: { label: <Unlock className="w-4 h-4" /> },
  lockRule: { label: <Unlock className="w-4 h-4" /> },
  lockGroupDisabled: { label: <Lock className="w-4 h-4" /> },
  lockRuleDisabled: { label: <Lock className="w-4 h-4" /> },
  shiftActionDown: { label: <ChevronDown className="w-4 h-4" /> },
  shiftActionUp: { label: <ChevronUp className="w-4 h-4" /> },
} satisfies Partial<TranslationsType>;

export const QueryBuilderContext = getCompatContextProvider({
  controlClassnames: ControlClassnames,
  controlElements: ControlElements,
  translations: Translations,
});
