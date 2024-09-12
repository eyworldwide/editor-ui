import React, { cloneElement, ComponentProps, forwardRef, ReactElement, ReactNode } from "react";
import { styled, type CSS, VariantProps } from "../../../design-system";
import { v4 as uuidv4 } from "uuid";
import { Label, type LabelProps } from "./Label";

const StyledField = styled("div", {
  display: "grid",
  columnGap: "$1",
  gridColumn: "2 / -1",
  alignItems: "center",
  variants: {
    column: {
      1: {
        gridTemplateColumns: "1fr"
      },
      2: {
        gridTemplateColumns: "repeat(2, 1fr)"
      },
      3: {
        gridTemplateColumns: "repeat(3, 1fr)"
      },
      4: {
        gridTemplateColumns: "repeat(4, 1fr)"
      },
      color: {
        gridTemplateColumns: "24px 1fr 52px"
      },
      number: {
        gridTemplateColumns: "minmax(0, 8fr) repeat(2, 1fr)",
      },
      asset: {
        gridTemplateColumns: "minmax(0, 8fr) $6 $6",
      },
      gradient: {

      }
    }
  }
});

const StyledFormItem = styled('div', {
  display: "grid",
  width: "100%",
  padding: "$0_5",
  gridTemplateColumns: "minmax(0px, 1.5fr) repeat(3, minmax(0px, 1fr))",
  gridTemplateRows: "auto",
  columnGap: "$1",
  alignItems: "center",
  variants: {
    withoutLabel: {
      true: {
        gridTemplateColumns: "1fr",
      }
    },
    direction: {
      column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }
    }
  }

});

export interface BaseFormItemProps<V> {
  label?: string;
  info?: ReactNode;
  disabled?: boolean;
  value: V;
  onChange?: (value: V) => void;
  formEndSlot?: ReactNode;
  formStartSlot?: ReactNode;
}

export interface FormItemRangeProps extends BaseFormItemProps<number> {
  min?: number;
  max?: number;
  step?: number;
  dragStep?: number;
}

export interface FormItemSelectableProps<T> extends BaseFormItemProps<T> {
  options: { value: T, label: ReactNode }[];
}

export interface FormItemProps extends Omit<BaseFormItemProps<any>, 'value' | 'onChange'> {
  labelStyle?: CSS;
  children?: React.ReactNode;
  css?: CSS;
  fieldCss?: CSS;
  fieldColumn?: VariantProps<typeof StyledField>['column'];
}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  function FormItem(props, forwardedRef) {
    const {
      label: propLabel,
      fieldColumn,
      children,
      labelStyle,
      info,
      formStartSlot,
      formEndSlot,
      fieldCss,
      css,
      ...rest
    } = props;

    const dir = "row";
    const defaultSize = "sm";

    const name = propLabel;

    const label = `${(name ?? "").replace(/\s/g, "-")}-${uuidv4()}`;
    const withoutLabel = !!label;

    const decorateChildren = React.Children.toArray(children).map((child) => {
      if (React.isValidElement(child)) {
        return cloneElement(child as ReactElement, {
          id: label,
          size: defaultSize,
          label: name
        });
      }
      return null;
    });

    return (
      <StyledFormItem ref={forwardedRef} dir={dir} withoutLabel={!withoutLabel} {...rest}>  
        {withoutLabel && (
          <Label
            info={info}
            htmlFor={label}
            label={name ?? ''}
            css={labelStyle}
            startSlot={formStartSlot}
            endSlot={formEndSlot}
          />
        )}
        <StyledField column={fieldColumn} css={fieldCss}>
          {decorateChildren}
        </StyledField>
      </StyledFormItem>
    );
  }
);

export { FormItem };
