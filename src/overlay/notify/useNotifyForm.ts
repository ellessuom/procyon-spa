import { useState, type FormEvent, type MouseEvent } from 'react'

// Kit form used only as a subscribe endpoint (our own form, not Kit's embed). Form IDs are public.
const KIT_FORM_ENDPOINT = 'https://app.kit.com/forms/9977592/subscriptions'
export const HONEYPOT = 'website'
const NOTED_MS = 3000

export type NotifyStatus = 'idle' | 'sending' | 'done' | 'verify' | 'error'

/** Kit answers 200 either way: "success", or "quarantined" with a bot-check page the visitor must pass. */
type KitReply = { status: string; url?: string }

const subscribe = (data: FormData) =>
  fetch(KIT_FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
    .then((res) => (res.ok ? (res.json() as Promise<KitReply>) : null))
    .catch(() => null)

/** Sign-up state: posts the email to Kit and shows the result (or Kit's bot check) under the field. */
export function useNotifyForm() {
  const [status, setStatus] = useState<NotifyStatus>('idle')
  const [guardUrl, setGuardUrl] = useState('')

  const showThenReset = (next: 'done' | 'error', form?: HTMLFormElement) => {
    setStatus(next)
    setTimeout(() => {
      setStatus('idle')
      form?.reset() // only after success: a failed email stays, so it can be retried
    }, NOTED_MS)
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    // bots fill every field: pretend it worked without sending anything
    const bot = Boolean(data.get(HONEYPOT))
    data.delete(HONEYPOT)
    setStatus('sending')
    const reply = bot ? { status: 'success' } : await subscribe(data)

    if (reply?.status === 'quarantined' && reply.url) {
      setGuardUrl(reply.url)
      setStatus('verify') // stays until the visitor opens the check
    } else if (reply?.status === 'success') showThenReset('done', form)
    else showThenReset('error')
  }

  /** Kit's bot check opens in a new tab; the sign-up finishes there. */
  const openGuard = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.closest('form')?.reset()
    setStatus('idle')
  }

  return { status, guardUrl, submit, openGuard }
}
