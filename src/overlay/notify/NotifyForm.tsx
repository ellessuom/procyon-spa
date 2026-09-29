import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { HONEYPOT, useNotifyForm } from './useNotifyForm'

const MESSAGES = {
  idle: '',
  sending: '',
  verify: '',
  done: 'You’re on the list',
  error: 'Something went wrong. Try again',
}

export default function NotifyForm() {
  const { status, guardUrl, submit, openGuard } = useNotifyForm()
  const shown = status === 'done' || status === 'error' || status === 'verify'

  return (
    <form className={`notify${shown ? ' is-noted' : ''}`} onSubmit={submit}>
      <label className="label" htmlFor="email">
        Get notified at launch
      </label>
      <div className="field">
        <input id="email" name="email_address" type="email" required placeholder="Email address" autoComplete="email" />
        <button type="submit" className="label" disabled={status === 'sending'}>
          Notify me <FiArrowRight aria-hidden />
        </button>
        <p className="noted label" role="status">
          {status === 'verify' ? (
            <a href={guardUrl} target="_blank" rel="noopener" onClick={openGuard}>
              One more step: confirm you’re human <FiArrowUpRight aria-hidden />
            </a>
          ) : (
            MESSAGES[status]
          )}
        </p>
      </div>
      {/* honeypot: hidden from people, filled in by bots */}
      <input name={HONEYPOT} className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden />
      <p className="consent">Launch news only. Unsubscribe anytime.</p>
    </form>
  )
}
