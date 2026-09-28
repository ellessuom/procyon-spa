import { FiArrowRight } from 'react-icons/fi'
import { useNotifyForm } from './useNotifyForm'

export default function NotifyForm() {
  const { noted, submit } = useNotifyForm()

  return (
    <form className={`notify${noted ? ' is-noted' : ''}`} onSubmit={submit}>
      <label className="label" htmlFor="email">
        Get notified at launch
      </label>
      <div className="field">
        <input id="email" name="email" type="email" required placeholder="Email address" autoComplete="email" />
        <button type="submit" className="label">
          Notify me <FiArrowRight aria-hidden />
        </button>
        <p className="noted label" role="status">
          {noted ? 'You’re on the list' : ''}
        </p>
      </div>
    </form>
  )
}
