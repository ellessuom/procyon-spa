import { useState, type FormEvent } from 'react'

const NOTED_MS = 3000

/** Sign-up state: shows the confirmation for a few seconds, then resets the form. */
export function useNotifyForm() {
  const [noted, setNoted] = useState(false)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    // TODO: POST to endpoint — send new FormData(form).get('email') to the mailing-list backend.
    setNoted(true)
    setTimeout(() => {
      setNoted(false)
      form.reset()
    }, NOTED_MS)
  }

  return { noted, submit }
}
