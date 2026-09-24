import { useId, useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
  fieldClassName: string
}

export function PasswordInput({ label, fieldClassName, id, ...inputProps }: PasswordInputProps) {
  const { t } = useTranslation()
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [visible, setVisible] = useState(false)

  return (
    <div className={fieldClassName}>
      <label htmlFor={inputId}>{label}</label>
      <div className="password-input">
        <input {...inputProps} id={inputId} type={visible ? 'text' : 'password'} />
        <button
          type="button"
          className="password-input__toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={t(visible ? 'common.hidePassword' : 'common.showPassword')}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
