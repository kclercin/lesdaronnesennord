import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import {
  Sparkle,
  LogoCircle,
  IconCosmetic,
  IconSpray,
  IconChalk,
  IconRecycle,
} from "../components/doodles"
import sessionsData from "../data/sessions.json"

/* Les prochaines sessions sont éditables dans src/data/sessions.json (rebuild ensuite).
   - bookingUrl : page de réservation externe utilisée par défaut (ouverte dans un nouvel onglet).
   - sessions[].url : optionnel, pour qu'une session pointe vers sa propre page de réservation.
   Champs affichés : day, month, place, city. */
type Session = {
  day: string
  month: string
  place: string
  city: string
  url?: string
}

const { bookingUrl, sessions: SESSIONS } = sessionsData as {
  bookingUrl: string
  sessions: Session[]
}

const bookingHref = (s: Session) => s.url || bookingUrl

const propose = [
  { icon: <IconCosmetic />, title: "Apprendre", text: "Des ateliers pratiques pour fabriquer vos produits du quotidien.", radius: "240px 18px 220px 18px / 18px 220px 18px 240px" },
  { icon: <IconSpray />, title: "Partager", text: "Des moments d'échange pour diffuser les bonnes astuces et adresses locales.", radius: "18px 220px 18px 240px / 240px 18px 220px 18px" },
  { icon: <IconRecycle />, title: "Agir", text: "Des opérations concrètes pour préserver notre environnement proche.", radius: "220px 18px 240px 18px / 18px 240px 18px 220px" },
]

const ateliers = [
  { icon: <IconCosmetic />, title: "Cosmétiques fait maison", text: "Des soins sains, sur-mesure et économiques." },
  { icon: <IconSpray />, title: "Produits ménagers", text: "Lessive, spray multi-usage : une maison propre sans plastique ni toxiques." },
  { icon: <IconChalk />, title: "Loisirs créatifs DIY", text: "Des recettes ludiques à refaire en famille, petits et grands." },
  { icon: <IconRecycle />, title: "Upcycling & récup'", text: "Donner une seconde vie aux objets et prendre soin de ce qu'on a déjà." },
]

const ZdThequePage = () => {
  const trackRef = React.useRef<HTMLDivElement>(null)

  const scrollTrack = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-card]")
    const step = card ? card.offsetWidth + 22 : 340
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  return (
    <Layout active="zdtheque">
      {/* ===================== HERO ===================== */}
      <section
        id="zdtheque"
        style={{
          padding: "clamp(40px,6vw,80px) clamp(20px,5vw,56px) clamp(48px,6vw,84px)",
          background: "#FBF6E9",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(27,26,23,.08)",
        }}
      >
        <div className="rc-2" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "clamp(28px,5vw,60px)", alignItems: "center" }}>
          <div>
            <div style={{ width: "min(450px,100%)", aspectRatio: "1", margin: "0 auto" }}>
              <LogoCircle label="La ZD'thèque" fontSize={26} color="#1B1A17" />
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: 34, color: "#B8911E", transform: "rotate(-1deg)", lineHeight: 1 }}>
              Le meilleur déchet est celui que l'on ne produit pas.
            </div>
            <h1
              className="rc-htitle"
              style={{ margin: "6px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(48px,8vw,92px)", lineHeight: 0.9, letterSpacing: ".5px", color: "#1B1A17" }}
            >
              La ZD'thèque
            </h1>
            <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.7, color: "#4A463C", maxWidth: "46ch" }}>
              Bienvenue dans notre ZD'thèque dédiée au mode de vie « Zéro Déchet ». Que vous soyez déjà adepte du bocal en verre ou que vous vous demandiez par où commencer, <strong>notre association vous accompagne</strong> — sans jugement, à votre rythme.
            </p>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="dc-btn dc-btn-dark" style={{ display: "inline-block", marginTop: 26, fontWeight: 700, fontSize: 16, padding: "15px 30px" }}>
              Réserver mon créneau&nbsp;!
            </a>
          </div>
        </div>
      </section>

      {/* ===================== CE QUE NOUS PROPOSONS ===================== */}
      <section style={{ padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)", background: "#FFFFFF", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#C9A227" }}>Ce que nous proposons</div>
            <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1 }}>Apprendre, partager, agir</h2>
            <p style={{ margin: "14px auto 0", fontSize: 17, lineHeight: 1.6, color: "#6B675C", maxWidth: "50ch" }}>
              Le passage à l'action n'est pas une contrainte, mais une occasion de mieux consommer, de faire des économies et de redécouvrir le plaisir du « faire soi-même ».
            </p>
          </div>
          <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 44 }}>
            {propose.map(c => (
              <article key={c.title} style={{ background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: c.radius, padding: "32px 28px" }}>
                <div style={{ marginBottom: 14 }}>{c.icon}</div>
                <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 27, lineHeight: 1 }}>{c.title}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#4A463C" }}>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SESSIONS ===================== */}
      <section id="sessions" style={{ padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)", background: "#FFFFFF", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="rc-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,56px)", alignItems: "end" }}>
            <div>
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: 38, color: "#B8911E", transform: "rotate(-2deg)", lineHeight: 1 }}>Retrouvez-nous et inscrivez-vous !</div>
              <h2 style={{ margin: "8px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(30px,3.6vw,40px)", lineHeight: 1, letterSpacing: ".5px" }}>Prochaines sessions</h2>
            </div>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "#4A463C" }}>
              On se rencontre le <strong>mercredi à partir de 14h</strong> dans divers lieux de la métropole lilloise. Les ateliers sont <strong>entièrement gratuits</strong> : réservez votre créneau et venez découvrir astuces et recettes — produits ménagers, craies, cosmétiques home made…
            </p>
          </div>

          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: 22,
              marginTop: 38,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              padding: "4px 4px 20px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {SESSIONS.map(s => (
              <article
                key={`${s.day} ${s.month} ${s.place}`}
                data-card
                style={{ flex: "0 0 300px", scrollSnapAlign: "start", background: "#FFFFFF", border: "2px solid #1B1A17", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 18px 40px -30px rgba(27,26,23,.7)" }}
              >
                <div style={{ background: "#1B1A17", color: "#FBF6E9", padding: "18px 22px", display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 42, lineHeight: 0.9, color: "#E8BE36" }}>{s.day}</span>
                  <span style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontSize: 20, letterSpacing: "1px" }}>{s.month}</span>
                </div>
                <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{s.place}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 14.5, color: "#6B675C" }}>{s.city}</p>
                  <p style={{ margin: "14px 0 18px", fontSize: 14, color: "#4A463C" }}>Mercredi, à partir de 14h.</p>
                  <a href={bookingHref(s)} target="_blank" rel="noopener noreferrer" className="dc-btn dc-btn-gold" style={{ marginTop: "auto", textAlign: "center", fontWeight: 700, fontSize: 15, padding: "12px 18px", borderRadius: 40 }}>
                    Réserver ma place
                  </a>
                </div>
              </article>
            ))}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-card
              className="dc-lift-sm"
              style={{ flex: "0 0 300px", scrollSnapAlign: "start", textDecoration: "none", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", background: "linear-gradient(160deg,#D8B43A,#C49C22)", border: "2px solid #1B1A17", boxShadow: "0 18px 40px -30px rgba(27,26,23,.7)" }}
            >
              <div style={{ background: "#1B1A17", color: "#E8BE36", padding: "18px 22px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontSize: 22, letterSpacing: "1px" }}>Et vous&nbsp;?</span>
              </div>
              <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ marginBottom: 10 }}><Sparkle size={34} color="#1B1A17" /></div>
                <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 30, lineHeight: 1, color: "#1B1A17" }}>Réserver mon créneau</h3>
                <p style={{ margin: "8px 0 18px", fontSize: 14, lineHeight: 1.55, color: "#4a3c10" }}>Retrouvez toutes nos prochaines dates et réservez votre place directement en ligne.</p>
                <span style={{ marginTop: "auto", textAlign: "center", width: "100%", background: "#1B1A17", color: "#FBF6E9", fontWeight: 700, fontSize: 15, padding: "12px 18px", borderRadius: 40 }}>Réserver en ligne</span>
              </div>
            </a>
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 26 }}>
            <button type="button" aria-label="Sessions précédentes" onClick={() => scrollTrack(-1)} className="dc-arrow dc-arrow-light">←</button>
            <button type="button" aria-label="Sessions suivantes" onClick={() => scrollTrack(1)} className="dc-arrow dc-arrow-dark">→</button>
          </div>
        </div>
      </section>

      {/* ===================== LES ATELIERS ===================== */}
      <section id="ateliers" style={{ padding: "clamp(48px,6vw,92px) clamp(20px,5vw,56px)", background: "#FFFFFF", borderTop: "1px solid rgba(27,26,23,.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(40px,5.2vw,62px)", lineHeight: 1 }}>Prendre soin de vous, au naturel</h2>
            <p style={{ margin: "14px auto 0", fontSize: 17, lineHeight: 1.6, color: "#6B675C", maxWidth: "48ch" }}>
              On touche les matières, on formule, on manipule, on rit. Voici ce qu'on fabrique ensemble pendant nos rendez-vous.
            </p>
          </div>
          <div className="rc-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 44 }}>
            {ateliers.map(c => (
              <article key={c.title} style={{ background: "#FBF6E9", border: "2px solid #1B1A17", borderRadius: 22, padding: "26px 22px", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{c.icon}</div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{c.title}</h3>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color: "#4A463C" }}>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA BAND ===================== */}
      <section style={{ padding: "clamp(44px,5vw,80px) clamp(20px,5vw,56px)", background: "#FBF6E9" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", background: "#1B1A17", color: "#FBF6E9", borderRadius: 40, padding: "clamp(34px,5vw,60px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <h2 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontSize: "clamp(40px,5.5vw,64px)", lineHeight: 1, color: "#E8BE36" }}>Une place vous attend</h2>
          <p style={{ margin: "12px auto 0", maxWidth: "42ch", fontSize: 17, lineHeight: 1.6, color: "rgba(251,246,233,.78)" }}>
            Réservez votre créneau gratuit, venez les mains vides et repartez avec vos premières recettes.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
            <a href="#sessions" className="dc-btn dc-btn-gold-bright" style={{ fontWeight: 700, fontSize: 16, padding: "15px 30px" }}>Voir les prochaines sessions</a>
            <a href="/" className="dc-btn dc-btn-ghost-light" style={{ fontSize: 16, padding: "14px 30px" }}>Retour à l'accueil</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default ZdThequePage

export const Head: HeadFC = () => (
  <>
    <title>La ZD'thèque — Sessions gratuites zéro déchet | Les Daronnes en Nord</title>
    <meta
      name="description"
      content="Sessions gratuites d'entraide zéro déchet et cosmétiques maison dans la métropole lilloise. Réservez votre créneau : Villeneuve-d'Ascq, Lille, Roubaix, Lys-lez-Lannoy."
    />
    <html lang="fr" />
  </>
)
