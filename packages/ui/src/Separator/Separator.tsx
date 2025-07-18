import { forwardRef } from 'react'
import * as PrimitiveSeparator from '@radix-ui/react-separator'
import { CSS, StitchesComponent, styled, VariantProps } from '../design-system'
import { Text } from '../Typography'

const StyledCrosslineText = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  userSelect: 'none',
  '&::before': {
    borderBottom: '1px solid $grayA6',
    content: '',
    flex: '1 0 0',
    transform: 'translateY(-0.5px)',
  },
  '&::after': {
    borderBottom: '1px solid $grayA6',
    content: '',
    flex: '1 0 0',
    transform: 'translateY(-0.5px)',
  },
  '& > div': {
    position: 'relative',
    top: -2,
    maxWidth: 'calc(100% - 60px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '$gray10',
    fontSize: '$3',
    flex: '0 1 auto',
    margin: '0 $3',
  },
})

const StyledSeparator = styled(PrimitiveSeparator.Root, {
  backgroundColor: '$grayA5',
  variants: {
    orientation: {
      horizontal: {
        height: 1,
        width: '100%',
      },
      vertical: {
        height: '100%',
        width: 1,
      },
    },
    raw: {
      true: {
        // display: "block",
        display: 'none',
        height: '1px',
        width: '100%',
        margin: 0,
        backgroundColor: '$appBg',
        '& + &': {
          display: 'none',
        },
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export interface SeparatorProps extends StitchesComponent<typeof StyledSeparator> {
  text?: string
  css?: CSS
  orientation?: 'horizontal' | 'vertical'
  raw?: boolean
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(props, forwardedRef) {
  const { text, ...rest } = props
  if (text) {
    return (
      <StyledCrosslineText {...rest} ref={forwardedRef}>
        <div>
          <Text size="1">{text}</Text>
        </div>
      </StyledCrosslineText>
    )
  }

  return <StyledSeparator {...rest} />
})

export { Separator }
