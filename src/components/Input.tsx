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
        className={`w-full text-[16px] rounded-lg border bg-white px-2 py-1 text-gray-0 outline-none placeholder:text-gray-2 disabled:cursor-not-allowed disabled:bg-grey-3/30 ${error ? 'border-alert' : 'border-gray-3'} ${className}`}
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