import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import { Sparkle } from "../components/doodles"

const NotFoundPage = () => (
  <Layout active="">
    <section
      style={{
        padding: "clamp(56px,9vw,120px) clamp(20px,5vw,56px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "6%",
          transform: "translateX(-50%)",
          width: "min(520px, 70vw)",
          height: "min(520px,70vw)",
          background: "radial-gradient(circle, rgba(214,178,52,.32), rgba(214,178,52,0) 70%)",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Caveat',cursive", fontSize: 32, color: "#B8911E", transform: "rotate(-2deg)" }}>
          <Sparkle size={26} color="#E8BE36" /> Oups, page introuvable
        </div>
        <h1 style={{ margin: "10px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(64px,14vw,140px)", lineHeight: 0.9, letterSpacing: ".5px", color: "#1B1A17" }}>
          404
        </h1>
        <p style={{ margin: "16px auto 0", maxWidth: "40ch", fontSize: 18, lineHeight: 1.65, color: "#4A463C" }}>
          Cette page a filé comme un savon mouillé. Revenons à l'essentiel : nos ateliers, nos recettes et nos rendez-vous.
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
          <a href="/" className="dc-btn dc-btn-dark" style={{ fontSize: 16, padding: "15px 30px" }}>Retour à l'accueil</a>
          <a href="/la-zd-theque#sessions" className="dc-btn dc-btn-outline dc-btn-outline-gold" style={{ fontSize: 16, padding: "14px 30px" }}>Voir les sessions</a>
        </div>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage

export const Head: HeadFC = () => (
  <>
    <title>Page introuvable — Les Daronnes en Nord</title>
    <html lang="fr" />
  </>
)
