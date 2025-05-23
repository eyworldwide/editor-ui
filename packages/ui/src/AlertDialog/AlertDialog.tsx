import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertDialogProps } from '@radix-ui/react-alert-dialog'
import React, { forwardRef, PropsWithChildren, ReactElement, useImperativeHandle, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { styled, animations } from '../design-system'
import { Button } from '../Button'
import { Flex } from '../Flex'
import { contentStyle, overlayStyle } from '../design-system/recipes'
import { Text, Title } from '../Typography'

const { Root, Trigger, Portal, Overlay, Content, Title: AlertTitle, Description, Cancel, Action } = AlertDialogPrimitive

const StyledOverlay = styled(Overlay, {
  position: 'fixed',
  inset: 0,
  animation: `${animations.overlayFadeIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
})
const StyledContent = styled(Content, {
  position: 'fixed',
  padding: '$5',
  top: '50%',
  left: '50%',
  maxWidth: '26rem',
  width: '100%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '$gray1',
  borderRadius: '$5',
  border: '1px solid $gray4',
  zIndex: 50,
  outline: 'none',
  boxSizing: 'content-box',
  animation: `${animations.contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,

  '&:focus': { outline: 'none' },

  "&[data-state=open]": {
    animation: `${animations.contentFadeIn} 250ms ease`
  },
  "&[data-state=closed]": {
    animation: `${animations.contentFadeOut} 250ms ease`
  }
})

const StyledFooter = styled(Flex, {
  marginTop: '$6',
  justifyContent: 'flex-end',
})

export interface IAlertDialogProps {
  trigger?: React.ReactNode
  title: string
  description?: string | React.ReactNode
  cancelText?: string
  confirmText?: string
  onClose?: () => void
  onConfirm?: () => void
  zIndex?: number
  actionable?: boolean
}

function AlertDialog(props: PropsWithChildren<IAlertDialogProps & AlertDialogProps>) {
  const {
    trigger,
    title,
    description,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    onConfirm,
    onClose,
    zIndex,
    actionable = true,
    ...rest
  } = props
  return (
    <Root {...rest}>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>
        <StyledOverlay style={{ zIndex }} />
        <StyledContent style={{ zIndex }}>
          <AlertTitle asChild>
            <Title size={3} css={{ marginBottom: '$3' }} weight="bold">
              {title}
            </Title>
          </AlertTitle>
          {description && (
            <Description asChild>
              <Text size="2" secondary css={{ whiteSpace: 'pre-line' }}>
                {description}
              </Text>
            </Description>
          )}
          {actionable && (
            <StyledFooter gap="sm" justifyContent="end" css={{ marginTop: '$8' }}>
              {onClose && (
                <Cancel asChild>
                  <Button variant="secondary" size="md" onClick={onClose}>
                    {cancelText}
                  </Button>
                </Cancel>
              )}
              {onConfirm && (
                <Action asChild>
                  <Button variant="primary" critical size="md" onClick={onConfirm}>
                    {confirmText}
                  </Button>
                </Action>
              )}
            </StyledFooter>
          )}
        </StyledContent>
      </Portal>
    </Root>
  )
}

function genPortalId() {
  return `editor-portal-id-${new Date().getTime()}`
}

function showAlert(props: Omit<IAlertDialogProps, 'trigger'>) {
  const el = document.createElement('span')
  const id = genPortalId()
  el.id = id
  document.body.appendChild(el)
  const root = createRoot(el)

  const Wrapper = forwardRef(function AlertWrapper(_, ref) {
    const [open, setOpen] = useState(true)

    const close = () => {
      setOpen(false)
      root.unmount()
      if (props.onClose) {
        props.onClose()
      }
    }

    const confirm = () => {
      setOpen(false)
      if (props.onConfirm) {
        props.onConfirm()
      }
    }

    useImperativeHandle(ref, () => ({
      close,
    }))

    return (
      <AlertDialog
        {...props}
        trigger={null}
        onClose={close}
        onConfirm={confirm}
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) {
            close()
          }
        }}
      />
    )
  })

  root.render(<Wrapper />)

  return {
    close,
  }
}

export { AlertDialog, showAlert }
