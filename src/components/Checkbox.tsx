import { useId, type ComponentProps } from 'react'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
  error?: string
}

export function Checkbox({ label, error, className = '', id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className="flex cursor-pointer items-center gap-2 has-disabled:cursor-not-allowed has-disabled:opacity-50"
      >
        <input
          id={checkboxId}
          type="checkbox"
          aria-invalid={!!error}
          className={`size-5 cursor-pointer rounded accent-success
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success
            disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        <span className="text-text-2 text-grey-0">{label}</span>
      </label>

      {error && (
        <span role="alert" className="text-caption-2 text-alert">
          {error}
        </span>
      )}
    </div>
  )
}