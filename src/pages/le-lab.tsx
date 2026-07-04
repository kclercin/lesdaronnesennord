import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import { Sparkle, LogoCircle, IconLeafLab, IconTools, IconSpark } from "../components/doodles"

const pourQui = [
  { icon: <IconLeafLab />, title: "Créateurs éco-responsables", text: "Cosmétiques, upcycling, zéro déchet : vous portez des produits ou un savoir-faire qui ont du sens.", radius: "240px 18px 220px 18px / 18px 220px 18px 240px" },
  { icon: <IconTools />, title: "Artisans en développement", text: "Vous voulez diversifier votre activité et créer une nouvelle source de revenus grâce à la transmission.", radius: "18px 220px 18px 240px / 240px 18px 220px 18px" },
  { icon: <IconSpark />, title: "Futurs animateurs", text: "Vous souhaitez animer des ateliers de manière impactante et professionnelle, sans partir de zéro.", radius: "220px 18px 240px 18px / 18px 240px 18px 220px" },
]

const etapes = [
  { n: "01", title: "Concevoir", text: "On clarifie votre intention, votre public et le fil pédagogique de l'atelier." },
  { n: "02", title: "Structurer", text: "Déroulé, matériel, recettes, sécurité : on pose un cadre solide et reproductible." },
  { n: "03", title: "Animer", text: "On vous coache sur la posture et le rythme pour des ateliers vivants et conviviaux." },
]

const LeLabPage = () => (
  <Layout active="lab">
    {/* ===================== HERO ===================== */}
    <section style={{ padding: "clamp(40px,6vw,80px) clamp(20px,5vw,56px) clamp(48px,6vw,84px)", background: "#FBF6E9", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
      <div className="rc-2" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "clamp(28px,5vw,60px)", alignItems: "center" }}>
        <div>
          <div style={{ width: "min(450px,100%)", aspectRatio: "1", margin: "0 auto" }}>
            <LogoCircle label="Le LAB" fontSize={30} color="#1B1A17" />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: 34, color: "#B8911E", transform: "rotate(-1deg)", lineHeight: 1 }}>
            Incubateur de partage pour artisans & créateurs
          </div>
          <h1 className="rc-htitle rc-htitle-lg" style={{ margin: "6px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(56px,9vw,104px)", lineHeight: 0.9, letterSpacing: ".5px", color: "#1B1A17" }}>
            Le LAB
          </h1>
          <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.7, color: "#4A463C", maxWidth: "46ch" }}>
            Vous êtes artisan, créateur ou porteur de projet et vous souhaitez transmettre votre savoir-faire à travers des ateliers&nbsp;? <strong>Ne restez pas seul&nbsp;!</strong> Le LAB met à votre disposition un lieu et une équipe pluridisciplinaire pour concevoir, structurer et animer vos propres ateliers tout naturellement.
          </p>
          <a href="/contact?sujet=lab#form" className="dc-btn dc-btn-dark" style={{ display: "inline-block", marginTop: 26, fontWeight: 700, fontSize: 16, padding: "15px 30px" }}>
            Travaillons ensemble&nbsp;!
          </a>
        </div>
      </div>
    </section>

    {/* ===================== POUR QUI ===================== */}
    <section style={{ padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)", background: "#FFFFFF", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#C9A227" }}>Pour qui&nbsp;?</div>
          <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1 }}>Le LAB est fait pour vous si…</h2>
        </div>
        <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 44 }}>
          {pourQui.map(c => (
            <article key={c.title} style={{ background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: c.radius, padding: "32px 28px" }}>
              <div style={{ marginBottom: 14 }}>{c.icon}</div>
              <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 27, lineHeight: 1 }}>{c.title}</h3>
              <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#4A463C" }}>{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* ===================== ACCOMPAGNEMENT ===================== */}
    <section style={{ padding: "clamp(48px,6vw,96px) clamp(20px,5vw,56px)", background: "#1B1A17", color: "#FBF6E9", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -30, right: "5%", ["--r" as any]: "8deg", animation: "floaty 7s ease-in-out infinite" }}>
        <Sparkle size={96} color="rgba(232,190,54,.5)" />
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#E8BE36" }}>Notre accompagnement</div>
          <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1, color: "#E8BE36" }}>De l'idée à l'atelier qui tourne</h2>
          <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.7, color: "rgba(251,246,233,.78)" }}>
            Une équipe pluridisciplinaire à vos côtés, étape par étape — pour que votre atelier soit clair, fluide et fidèle à vos valeurs.
          </p>
        </div>
        <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 40 }}>
          {etapes.map(e => (
            <div key={e.n} style={{ border: "1.5px solid rgba(232,190,54,.4)", borderRadius: 18, padding: "26px 24px", background: "rgba(232,190,54,.06)" }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 40, color: "#E8BE36", lineHeight: 1 }}>{e.n}</div>
              <h3 style={{ margin: "10px 0 0", fontSize: 18, fontWeight: 700, color: "#E8BE36" }}>{e.title}</h3>
              <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "rgba(251,246,233,.74)" }}>{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===================== CTA BAND ===================== */}
    <section style={{ padding: "clamp(44px,5vw,80px) clamp(20px,5vw,56px)", background: "#FBF6E9" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", background: "linear-gradient(150deg,#D8B43A,#C09A20)", borderRadius: 40, padding: "clamp(34px,5vw,60px)", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 18, left: 30, ["--r" as any]: "-8deg", animation: "floaty 6s ease-in-out infinite" }}>
          <Sparkle size={34} color="#1B1A17" />
        </div>
        <div style={{ position: "absolute", bottom: 20, right: 40, ["--r" as any]: "8deg", animation: "floaty 7s ease-in-out infinite .5s" }}>
          <Sparkle size={34} color="#1B1A17" />
        </div>
        <h2 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontSize: "clamp(40px,5.5vw,64px)", lineHeight: 1, color: "#1B1A17" }}>Ne restez pas seul·e avec votre idée</h2>
        <p style={{ margin: "12px auto 0", maxWidth: "42ch", fontSize: 17, lineHeight: 1.6, color: "#4a3c10" }}>
          Parlons de votre projet d'atelier — on vous dit en toute transparence comment Le LAB peut vous aider.
        </p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
          <a href="/contact?sujet=lab#form" className="dc-btn dc-btn-dark" style={{ fontSize: 16, padding: "15px 30px" }}>Travaillons ensemble&nbsp;!</a>
        </div>
      </div>
    </section>
  </Layout>
)

export default LeLabPage

export const Head: HeadFC = () => (
  <>
    <title>Le LAB — Accompagnement des artisans & créateurs | Les Daronnes en Nord</title>
    <meta
      name="description"
      content="Le LAB accompagne artisans, créateurs et porteurs de projet pour concevoir, structurer et animer leurs propres ateliers au naturel dans la métropole lilloise."
    />
    <html lang="fr" />
  </>
)
