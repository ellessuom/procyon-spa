import { SOCIAL_LINKS } from './links'

export default function Socials() {
  return (
    <ul className="socials">
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} aria-label={label}>
            <Icon aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
