import { useId, type InputHTMLAttributes } from 'react'

import './TextField.css'

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  errorMessage?: string
}

export function TextField({ label, errorMessage, id, className, ...rest }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = errorMessage ? `${inputId}-error` : undefined

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={['text-field__input', className].filter(Boolean).join(' ')}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorId}
        {...rest}
      />
      {errorMessage ? (
        <p id={errorId} className="text-field__error">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
