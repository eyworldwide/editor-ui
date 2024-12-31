import React from "react";

import { Flex, Collapsible, type CollapsibleProps } from "@galacean/editor-ui";
import { BaseFormItemProps } from "../FormItem/FormItem";

export interface FormItemGroupProps extends CollapsibleProps, Omit<BaseFormItemProps<any>, 'value' | 'onChange'> {
  customTitle?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsible?: boolean;
  nesting?: boolean;
  // children: React.ReactNode;
  children: any;
}

function FormItemGroup(props: FormItemGroupProps) {
  const { label, nesting, collapsible, customTitle, defaultOpen = true, open, onOpenChange } = props;

  return (
    <Collapsible
      title={customTitle ?? label}
      defaultOpen={defaultOpen}
      open={open}
      nesting={nesting}
      transparent
      onOpenChange={onOpenChange}
      collapsible={collapsible}
      css={{ marginTop: '$0_5' }}
    >
      {props.children}
    </Collapsible>
  );
}

export { FormItemGroup };
