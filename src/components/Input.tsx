import { useId, type ComponentProps } from 'react'

type InputProps = ComponentProps<'input'> & {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-caption-1 font-medium text-grey-0">
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`text-text-2 rounded-lg border bg-white px-3 py-2 text-grey-0 outline-none
      placeholder:text-grey-2
      disabled:cursor-not-allowed disabled:bg-grey-3/30
      ${error ? 'border-alert' : 'border-grey-3'} ${className}`}
        {...props}
      />

      {error && (
        <span id={`${inputId}-error`} role="alert" className="text-caption-2 text-alert">
          {error}
        </span>
      )}
    </div>
  )
}