import type { ButtonHTMLAttributes } from 'react'

import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      className={['btn', `btn--${variant}`, className].filter(Boolean).join(' ')}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
}
