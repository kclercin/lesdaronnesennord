import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import { Sparkle, IconMailLine, IconGlobe, IconPin } from "../components/doodles"

const SUBJECTS = [
  "Un atelier grand public",
  "Une réservation ZD'thèque",
  "Le LAB (artisans & créateurs)",
  "Un atelier privé / sur-mesure",
  "Autre / question générale",
]
const LAB_SUBJECT = "Le LAB (artisans & créateurs)"

const buildMailto = (subject: string, fd: FormData) => {
  const name = (fd.get("name") as string) || ""
  const email = (fd.get("email") as string) || ""
  const message = (fd.get("message") as string) || ""
  const body = "Bonjour Les Daronnes,\n\n" + message + "\n\n— " + name + (email ? " (" + email + ")" : "")
  return (
    "mailto:bienvenue@lesdaronnesennord.fr?subject=" +
    encodeURIComponent("[" + subject + "] " + name) +
    "&body=" +
    encodeURIComponent(body)
  )
}

const ContactPage = () => {
  const [subject, setSubject] = React.useState(SUBJECTS[0])

  React.useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("sujet")
      if (p === "lab") setSubject(LAB_SUBJECT)
      else if ((window.location.hash || "").includes("lab")) setSubject(LAB_SUBJECT)
    } catch (e) {
      /* noop */
    }
  }, [])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    window.location.href = buildMailto(subject, fd)
  }

  const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 7, fontSize: 14, fontWeight: 600 }

  return (
    <Layout active="contact">
      {/* ===================== HERO ===================== */}
      <section style={{ position: "relative", padding: "clamp(40px,6vw,72px) clamp(20px,5vw,56px) clamp(8px,2vw,24px)", textAlign: "center" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: "min(640px, 80vw)", height: "min(520px,70vw)", background: "radial-gradient(circle, rgba(214,178,52,.32), rgba(214,178,52,0) 70%)", zIndex: 0, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Caveat',cursive", fontSize: 32, color: "#B8911E", transform: "rotate(-2deg)" }}>
            <Sparkle size={26} color="#E8BE36" /> Faisons connaissance
          </div>
          <h1 style={{ margin: "10px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(46px,8vw,86px)", lineHeight: 0.92, letterSpacing: ".5px" }}>Contact</h1>
          <p style={{ margin: "18px auto 0", maxWidth: "44ch", fontSize: 18, lineHeight: 1.65, color: "#4A463C" }}>
            Une question, une envie d'atelier, un projet à monter ensemble&nbsp;? Écrivez-nous — on répond avec plaisir, sans langue de bois.
          </p>
        </div>
      </section>

      {/* ===================== FORM + INFOS ===================== */}
      <section style={{ padding: "clamp(24px,4vw,48px) clamp(20px,5vw,56px) clamp(48px,6vw,90px)" }}>
        <div className="rc-2" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: "clamp(28px,5vw,52px)", alignItems: "start" }}>
          {/* FORM */}
          <form id="form" onSubmit={onSubmit} style={{ background: "#FFFFFF", border: "2.5px solid #1B1A17", borderRadius: 28, padding: "clamp(24px,3.5vw,40px)", boxShadow: "0 26px 56px -36px rgba(27,26,23,.6)" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 14, color: "#C9A227" }}>Écrivez-nous</div>
            <h2 style={{ margin: "8px 0 22px", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 38, lineHeight: 1 }}>Votre message</h2>

            <div className="rc-form-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label style={labelStyle}>
                Prénom &amp; nom
                <input className="rc-inp" type="text" name="name" placeholder="Camille Dupont" required />
              </label>
              <label style={labelStyle}>
                E-mail
                <input className="rc-inp" type="email" name="email" placeholder="camille@email.fr" required />
              </label>
            </div>

            <label style={{ ...labelStyle, marginTop: 16 }}>
              Votre demande concerne
              <select className="rc-inp" name="subject" value={subject} onChange={e => setSubject(e.target.value)}>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ ...labelStyle, marginTop: 16 }}>
              Votre message
              <textarea
                className="rc-inp"
                name="message"
                rows={5}
                placeholder="Dites-nous tout : votre projet, vos dates, le nombre de participants…"
                style={{ resize: "vertical", minHeight: 130 }}
                required
              />
            </label>

            <button type="submit" className="dc-btn dc-btn-dark" style={{ marginTop: 22, width: "100%", fontSize: 16, padding: "16px 24px" }}>
              Envoyer mon message
            </button>
            <p style={{ margin: "14px 0 0", fontSize: 13, lineHeight: 1.5, color: "#6B675C", textAlign: "center" }}>
              En cohérence avec notre démarche SMD, on privilégie un échange simple et direct — pas de formulaires à rallonge.
            </p>
          </form>

          {/* INFOS */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#1B1A17", color: "#FBF6E9", borderRadius: 24, padding: "28px 26px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -16, right: -10, ["--r" as any]: "8deg", animation: "floaty 7s ease-in-out infinite" }}>
                <Sparkle size={96} color="rgba(232,190,54,.5)" />
              </div>
              <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "2px", fontSize: 13, color: "#E8BE36" }}>Nous joindre</div>
              <h3 style={{ margin: "8px 0 18px", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 30, lineHeight: 1 }}>Directement</h3>
              <a href="mailto:bienvenue@lesdaronnesennord.fr" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#FBF6E9", fontSize: 15, padding: "8px 0" }}>
                <IconMailLine /> bienvenue@lesdaronnesennord.fr
              </a>
              <a href="https://lesdaronnesennord.fr" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#FBF6E9", fontSize: 15, padding: "8px 0" }}>
                <IconGlobe /> lesdaronnesennord.fr
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(251,246,233,.82)", fontSize: 15, padding: "8px 0" }}>
                <IconPin /> Métropole lilloise · Nord (59)
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "2px solid #1B1A17", borderRadius: 24, padding: 26 }}>
              <div style={{ fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 26, color: "#B8911E", lineHeight: 1 }}>Où nous trouver ?</div>
              <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#4A463C" }}>
                Nos ateliers tournent entre Villeneuve-d'Ascq, Lys-lez-Lannoy, Lille et Roubaix. Le calendrier complet est sur la page{" "}
                <a href="/la-zd-theque#sessions" style={{ color: "#8a6c12", fontWeight: 600 }}>Nos activités</a>.
              </p>
            </div>

            <div style={{ background: "linear-gradient(150deg,#D8B43A,#C09A20)", borderRadius: 24, padding: "24px 26px" }}>
              <div style={{ fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 26, color: "#1B1A17", lineHeight: 1 }}>Vous êtes artisan ?</div>
              <p style={{ margin: "10px 0 16px", fontSize: 14.5, lineHeight: 1.55, color: "#4a3c10" }}>
                Le LAB vous accompagne pour concevoir et animer vos propres ateliers.
              </p>
              <a
                href="#form"
                onClick={() => setSubject(LAB_SUBJECT)}
                className="dc-btn dc-btn-dark"
                style={{ display: "inline-block", fontSize: 14, padding: "11px 20px", borderRadius: 40 }}
              >
                Parler du LAB
              </a>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  )
}

export default ContactPage

export const Head: HeadFC = () => (
  <>
    <title>Contact — Les Daronnes en Nord</title>
    <meta
      name="description"
      content="Une question, une envie d'atelier ou un projet à monter ensemble ? Contactez Les Daronnes en Nord — ateliers cosmétiques maison et zéro déchet dans la métropole lilloise."
    />
    <html lang="fr" />
  </>
)
