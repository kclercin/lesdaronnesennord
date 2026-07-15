import * as React from "react"
import { Link } from "gatsby"
import { Logo } from "./doodles"

const linkStyle: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "rgba(251,246,233,.8)",
  fontSize: 15,
  padding: "5px 0",
}

const colTitle: React.CSSProperties = {
  fontFamily: "'Anton', sans-serif",
  textTransform: "uppercase",
  letterSpacing: 2,
  fontSize: 13,
  color: "#E8BE36",
  marginBottom: 12,
}

const FLink = ({ href, children }: { href: string; children: React.ReactNode }) =>
  href.startsWith("/") && !href.includes("#") ? (
    <Link to={href} style={linkStyle}>
      {children}
    </Link>
  ) : (
    <a href={href} style={linkStyle}>
      {children}
    </a>
  )

const SiteFooter = () => {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        background: "#1B1A17",
        color: "#FBF6E9",
        padding: "clamp(40px,5vw,64px) clamp(20px,5vw,56px) 32px",
      }}
    >
      <div
        className="rc-foot-2"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        <div>
          <span style={{ display: "inline-block", background: "#FBF6E9", padding: "14px 20px", borderRadius: 20 }}>
            <Logo height={92} />
          </span>
          <p
            style={{
              margin: "16px 0 0",
              maxWidth: "38ch",
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(251,246,233,.66)",
            }}
          >
            Ateliers de cosmétiques maison &amp; zéro déchet, dans la métropole lilloise.
            Apprendre, partager, agir — au naturel.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={colTitle}>Navigation</div>
            <FLink href="/#bonjour">Bonjour</FLink>
            <FLink href="/#engagements">Nos engagements</FLink>
            <FLink href="/la-zd-theque">La ZD'thèque</FLink>
            <FLink href="/le-lab">Le LAB</FLink>
            <FLink href="/nos-ateliers">Nos ateliers</FLink>
            <FLink href="/#apropos">À propos</FLink>
          </div>
          <div>
            <div style={colTitle}>Contact</div>
            <FLink href="/contact">Page contact</FLink>
            <FLink href="mailto:bienvenue@lesdaronnesennord.fr">bienvenue@lesdaronnesennord.fr</FLink>
            <FLink href="https://lesdaronnesennord.fr">lesdaronnesennord.fr</FLink>
            <span
              style={{
                display: "block",
                color: "rgba(251,246,233,.5)",
                fontSize: 13,
                paddingTop: 8,
              }}
            >
              Métropole lilloise · Nord (59)
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "28px auto 0",
          paddingTop: 20,
          borderTop: "1px solid rgba(251,246,233,.14)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          fontSize: 13,
          color: "rgba(251,246,233,.5)",
        }}
      >
        <span>© {year} Les Daronnes en Nord — Association loi 1901</span>
        <span>Zéro écran, 100&nbsp;% humain · Site éco-conçu (SMD)</span>
      </div>
    </footer>
  )
}

export default SiteFooter
