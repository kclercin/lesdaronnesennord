import * as React from "react"
import { Link } from "gatsby"
import { Logo } from "./doodles"

export type ActiveKey = "" | "accueil" | "zdtheque" | "lab" | "ateliers" | "contact"

type NavItem = { label: string; href: string; key: ActiveKey }

const NAV: NavItem[] = [
  { label: "Bienvenue", href: "/#bonjour", key: "" },
  { label: "La ZD'thèque", href: "/la-zd-theque", key: "zdtheque" },
  { label: "Le LAB", href: "/le-lab", key: "lab" },
  { label: "Nos ateliers", href: "/nos-ateliers", key: "ateliers" },
  { label: "Contact", href: "/contact", key: "contact" },
]

const Underline = () => (
  <span
    style={{
      display: "block",
      height: 2.5,
      background: "#C9A227",
      borderRadius: 2,
      marginTop: 3,
    }}
  />
)

/* liens de route -> Gatsby Link (navigation SPA) ; liens avec ancre -> <a> (défilement fiable) */
const NavLink = ({
  item,
  active,
  className,
  onClick,
}: {
  item: NavItem
  active: ActiveKey
  className: string
  onClick?: () => void
}) => {
  const isActive = !!item.key && item.key === active
  const content = (
    <>
      {item.label}
      {isActive && className.includes("dc-nav-link") && <Underline />}
    </>
  )
  const cls = className + (isActive && className.includes("dc-mobile-link") ? " is-active" : "")
  if (item.href.includes("#")) {
    return (
      <a href={item.href} className={cls} onClick={onClick}>
        {content}
      </a>
    )
  }
  return (
    <Link to={item.href} className={cls} onClick={onClick}>
      {content}
    </Link>
  )
}

const SiteHeader = ({ active = "" }: { active?: ActiveKey }) => {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        padding: "14px clamp(20px, 5vw, 56px)",
        background: "rgba(251,246,233,.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(27,26,23,.12)",
      }}
    >
      <Link
        to="/"
        aria-label="Les Daronnes en Nord — accueil"
        style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
        onClick={close}
      >
        <Logo height={54} />
      </Link>

      <nav className="rc-nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
        {NAV.map(item => (
          <NavLink key={item.label} item={item} active={active} className="dc-nav-link" />
        ))}
        <a
          href="/la-zd-theque#sessions"
          className="dc-btn dc-btn-dark"
          style={{ fontSize: 14, padding: "11px 20px" }}
        >
          Réserver un atelier
        </a>
      </nav>

      <button
        type="button"
        className="dc-burger"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {open ? (
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
            <path d="M5 5 19 19 M19 5 5 19" />
          </svg>
        ) : (
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16 M4 12h16 M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="dc-mobile-panel">
          {NAV.map(item => (
            <NavLink
              key={item.label}
              item={item}
              active={active}
              className="dc-mobile-link"
              onClick={close}
            />
          ))}
          <a
            href="/la-zd-theque#sessions"
            className="dc-btn dc-btn-dark"
            style={{ marginTop: 12, textAlign: "center", padding: "14px 20px", fontSize: 15 }}
            onClick={close}
          >
            Réserver un atelier
          </a>
        </div>
      )}
    </header>
  )
}

export default SiteHeader
