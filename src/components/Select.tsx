import { useId, type ComponentProps } from 'react'

type Option = { value: string | number; label: string }

type SelectProps = ComponentProps<'select'> & {
  label?: string
  error?: string
  options: Option[]
  placeholder?: string
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-caption-1 font-medium text-grey-0">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={`text-text-2 w-full appearance-none rounded-lg border bg-white py-2 pr-10 pl-3 text-grey-0 outline-none
      focus:border-brand focus:ring-2 focus:ring-brand-opacity
      disabled:cursor-not-allowed disabled:bg-grey-3/30
      ${error ? 'border-alert' : 'border-grey-3'} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Seta */}
        <svg
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-grey-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
        </svg>
      </div>

      {error && (
        <span id={`${selectId}-error`} role="alert" className="text-caption-2 text-alert">
          {error}
        </span>
      )}
    </div>
  )
}