import React, { createContext, useContext, forwardRef, useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { IconSearch, IconCheck, IconChevronDown, IconX } from '@tabler/icons-react'

import { PopoverCloseTrigger, Popover } from '../Popover'
import { Flex } from '../Flex'
import { Badge } from '../Badge'
import { styled } from '../design-system'
import { basicItemStyle } from '../design-system/recipes'

const StyledComboboxTrigger = styled('button', {
  all: 'unset',
  position: 'relative',
  display: 'flex',
  width: '100%',
  minHeight: '$6',
  gap: '$1',
  alignItems: 'center',
  padding: '$0_5 $6 $0_5 $0_5',
  borderRadius: '$2',
  boxSizing: 'border-box',
  backgroundColor: '$grayA3',
  '&:hover': {
    backgroundColor: '$gray4',
  },
})

const StyledChevronDown = styled(IconChevronDown, {
  height: '14px',
  width: '14px',
  color: '$gray11',
  flexShrink: 0,
  position: 'absolute',
  right: '$1_5',
  top: '50%',
  transform: 'translateY(-50%)',
})

const SearchIcon = styled(IconSearch, {
  height: '14px',
  width: '14px',
  color: '$gray11',
  strokeWidth: 1.5,
  flexShrink: 0,
})

const StyledPlaceholder = styled('span', {
  all: 'unset',
  fontSize: '11px',
  color: '$gray11',
})

const StyledComboboxContent = styled(Flex, {
  padding: '$1',
  minHeight: '60px',
  maxHeight: '300px',
  overflowY: 'auto',
  position: 'relative',
  flex: 1,
  flexWrap: 'nowrap !important',
  '&[data-state="open"]': {
    animation: 'none',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '$grayA5',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '$grayA6',
  },
})

const StyledComboboxSearchInput = styled('input', {
  all: 'unset',
  width: '100%',
  padding: '$1',
  fontSize: '$1',
  color: '$gray11',
  boxSizing: 'border-box',
})

const StyledComboBoxItem = styled('button', basicItemStyle, {
  userSelect: 'none',
  width: '100%',
  flexShrink: 0,
  variants: {
    focused: {
      true: {
        backgroundColor: '$grayA3',
      },
    },
    selected: {
      true: {
        '&:hover': {
          backgroundColor: '$grayA3',
        },
      },
    },
  },
})

interface ComboboxContextProps {
  autoClose: boolean
  placeholder?: string
  valueRenderer?: (value: string, location?: 'item' | 'trigger') => React.ReactNode

  value: string[]
  selectValue?: (val: string) => void

  open: boolean
  setOpen: (open: boolean) => void

  focusedIndex?: number
  setFocusedIndex?: (val: number) => void

  close?: () => void

  searchValue?: string
  setSearchValue?: (val: string) => void

  valueNode: any
  onValueNodeChange: (valueNode: any) => void
  maxDisplayCount?: number
  maxDisplayText?: string
}

const ComboboxContext = createContext<ComboboxContextProps>({
  autoClose: true,
  value: [],
  open: false,
  setOpen: () => {},

  valueNode: null,
  onValueNodeChange: () => {},
  maxDisplayCount: 0,
  maxDisplayText: '{count} items selected',
})

export interface ComboboxTriggerProps {
  placeholder?: string
  children?: React.ReactNode
  valueRenderer?: (value: string) => React.ReactNode
}

export const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  function ComboboxTrigger(props, forwardedRef) {
    const { value, onValueNodeChange, placeholder, maxDisplayCount, maxDisplayText } = useContext(ComboboxContext)
    const { valueRenderer, ...rest } = props

    const valueArray = Array.isArray(value) ? value : value ? [value] : []

    const shouldShowSummary = maxDisplayCount > 0 && valueArray.length > maxDisplayCount

    const summaryText = maxDisplayText.replace('{count}', valueArray.length.toString())

    return (
      <StyledComboboxTrigger {...rest} ref={forwardedRef}>
        <Flex gap="xxs" ref={onValueNodeChange}>
          {shouldShowSummary && <Badge>{summaryText}</Badge>}
        </Flex>
        {valueArray.length === 0 && <StyledPlaceholder>{placeholder}</StyledPlaceholder>}
        <StyledChevronDown />
      </StyledComboboxTrigger>
    )
  }
)

export interface ComboboxSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

function ComboboxSearchInput(props: ComboboxSearchInputProps) {
  const { close, searchValue, setSearchValue, selectValue, focusedIndex, setFocusedIndex } = useContext(ComboboxContext)
  const { onSearch, ...rest } = props

  const handleOnChange = (e) => {
    if (setSearchValue) {
      setSearchValue(e.target.value as string)
    }
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <Flex
      wrap={false}
      align="v"
      css={{
        borderBottom: '1px solid $border',
        padding: '0 $2 0 $1',
        flexShrink: 0,
      }}>
      <SearchIcon />
      <StyledComboboxSearchInput {...rest} value={searchValue} onChange={handleOnChange} />
      <IconX size="12px" />
    </Flex>
  )
}

export interface ComboboxItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  label?: string
  textValue?: string
  index?: number
  disabled?: boolean
  children: React.ReactNode
}

export function ComboboxItem(props: ComboboxItemProps) {
  const { value, children, index, ...rest } = props
  const {
    value: selectedValue,
    maxDisplayCount,
    focusedIndex,
    selectValue,
    close,
    setFocusedIndex,
    valueRenderer,
    valueNode,
    searchValue,
    autoClose,
  } = useContext(ComboboxContext)
  const selectedValueArray = Array.isArray(selectedValue) ? selectedValue : selectedValue ? [selectedValue] : []
  const isSelected = selectedValue.indexOf(value) !== -1
  const ivVisible = searchValue ? value.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 : true

  const preventDefault = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleRemove = () => {
    if (selectValue) {
      selectValue(value)
    }
  }

  function handleSelect(e) {
    e.preventDefault()
    e.stopPropagation()
    selectValue && selectValue(value)
    autoClose && close && close()
  }

  const shouldCreateBadge =
    isSelected && valueNode && (maxDisplayCount === 0 || selectedValueArray.length <= maxDisplayCount)

  return (
    <>
      {ivVisible && (
        <StyledComboBoxItem
          role="option"
          tabIndex={-1}
          {...rest}
          selected={isSelected}
          onPointerUp={handleSelect}
          focused={focusedIndex === index}>
          {valueRenderer ? valueRenderer(value) : children}
          {isSelected && <IconCheck size="12px" />}
        </StyledComboBoxItem>
      )}
      {shouldCreateBadge
        ? createPortal(
            <Badge onClick={preventDefault} closeable onClose={handleRemove}>
              {valueRenderer ? valueRenderer(value, 'trigger') : children}
            </Badge>,
            valueNode
          )
        : null}
    </>
  )
}

export interface ComboboxProps {
  /**
   * indicates if the select is multiple
   */
  multiple?: boolean
  /**
   * The placeholder for the combobox
   */
  placeholder?: string
  /**
   * If true, the combobox will display a search input
   *
   * @default true
   */
  searchable?: boolean

  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void

  children?: React.ReactNode

  onSearch?: (value: string) => void

  valueRenderer?: (value: string) => React.ReactNode

  /**
   * If true, the popover will close when an item is selected
   *
   * @default true
   */
  autoClose?: boolean

  /**
   * Maximum number of selected items to display in the trigger.
   * If more items are selected, a summary badge will be shown instead.
   * Set to 0 or null to always show all selected items.
   *
   * @default 0
   */
  maxDisplayCount?: number

  /**
   * Text to display when more items are selected than maxDisplayCount
   * Use {count} as a placeholder for the number of selected items
   *
   * @default "{count} items selected"
   */
  maxDisplayText?: string
}

export function Combobox(props: ComboboxProps) {
  const {
    searchable = true,
    autoClose = true,
    children,
    onSearch,
    valueRenderer,
    placeholder,
    maxDisplayCount = 0,
    maxDisplayText = '{count} items selected',
  } = props
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [valueNode, setValueNode] = React.useState(null)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const [searchValue, setSearchValue] = React.useState('')

  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue || [],
    onChange: props.onValueChange,
  })

  const selectValue = (val) => {
    if (!value) return
    if (value.includes(val)) {
      setValue(value!.filter((v) => v !== val))
    } else {
      setValue([...value, val])
    }
  }

  function close() {
    closeRef.current && closeRef.current.click()
  }

  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current
      if (content.scrollHeight > content.clientHeight) {
        content.style.overflowY = 'auto'
      }
    }
  }, [children])

  return (
    <ComboboxContext.Provider
      value={{
        value: value!,
        selectValue,
        valueRenderer,

        focusedIndex,
        setFocusedIndex,

        searchValue,
        setSearchValue,

        open,
        setOpen,
        close,

        valueNode,
        onValueNodeChange: setValueNode,
        autoClose,
        placeholder,
        maxDisplayCount,
        maxDisplayText,
      }}>
      <Popover
        compact
        sideOffset={4}
        forceRender
        constrainSize
        css={{
          maxHeight: 'var(--radix-popover-content-available-height)',
          display: 'flex',
          flexDirection: 'column',
        }}
        trigger={<ComboboxTrigger placeholder={placeholder} />}
        onOpenChange={setOpen}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: 'inherit',
          }}>
          {searchable && (
            <div style={{ flexShrink: 0 }}>
              <ComboboxSearchInput onSearch={onSearch} />
            </div>
          )}
          <StyledComboboxContent ref={contentRef} direction="column" role="listbox">
            {children}
          </StyledComboboxContent>
        </div>
        <PopoverCloseTrigger ref={closeRef} style={{ display: 'none' }} />
      </Popover>
    </ComboboxContext.Provider>
  )
}
