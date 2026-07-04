import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import {
  Sparkle,
  Bottles,
  Plant,
  LogoCircle,
  IconTransmission,
  IconPartage,
  IconExperience,
  IconMailGold,
  IconFileGold,
  IconBroomGold,
  IconLeafGold,
} from "../components/doodles"
import equipe from "../images/equipe-daronnes.png"

const btnBase = "dc-btn"

const IndexPage = () => {
  return (
    <Layout active="accueil">
      {/* ===================== HERO ===================== */}
      <section
        id="bonjour"
        style={{
          position: "relative",
          padding: "clamp(48px,7vw,96px) clamp(20px,5vw,56px) clamp(56px,7vw,104px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div className="rc-hero-deco" style={{ position: "absolute", left: "6%", top: "22%", transform: "rotate(-8deg)", opacity: 0.9 }}>
          <Bottles scale={0.7} />
        </div>
        <div className="rc-hero-deco" style={{ position: "absolute", right: "5%", bottom: "14%", transform: "rotate(6deg)" }}>
          <Plant />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "8%",
            transform: "translateX(-50%)",
            width: "min(560px, 70vw)",
            height: "min(560px,70vw)",
            background: "radial-gradient(circle, rgba(214,178,52,.35), rgba(214,178,52,0) 70%)",
            zIndex: 0,
          }}
        />
        <div className="rc-rise" style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Caveat', cursive",
              fontSize: 32,
              color: "#B8911E",
              transform: "rotate(-2deg)",
            }}
          >
            <Sparkle size={26} color="#E8BE36" /> Bienvenue, ravies de vous voir
          </div>
          <h1
            className="rc-h1"
            style={{
              margin: "14px auto 0",
              fontSize: "clamp(48px, 8vw, 92px)",
              lineHeight: 0.95,
              fontWeight: 600,
              letterSpacing: "-1.5px",
              maxWidth: "14ch",
            }}
          >
            Réapprendre à{" "}
            <span style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, textTransform: "uppercase", color: "#B8911E" }}>
              faire soi-même
            </span>{" "}
            au naturel.
          </h1>
          <p style={{ margin: "24px auto 0", maxWidth: "36em", fontSize: 19, lineHeight: 1.65, color: "#4A463C" }}>
            Ateliers de cosmétiques maison et zéro déchet à Lille et dans la métropole, animés par{" "}
            <strong>Les Daronnes en Nord</strong>. On touche les matières, on formule, on rit.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 32 }}>
            <a href="/la-zd-theque" className={`${btnBase} dc-btn-dark`} style={{ fontSize: 16, padding: "15px 28px" }}>
              Découvrir nos activités
            </a>
            <a href="/la-zd-theque#sessions" className={`${btnBase} dc-btn-outline dc-btn-outline-gold`} style={{ fontSize: 16, padding: "14px 28px" }}>
              Réserver un atelier
            </a>
          </div>
        </div>
      </section>

      {/* ===================== NOS ACTIVITÉS ===================== */}
      <section
        id="activites"
        style={{
          background: "linear-gradient(160deg,#D8B43A,#C49C22)",
          padding: "clamp(40px,6vw,76px) clamp(20px,5vw,56px)",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(27,26,23,.12)",
          borderBottom: "1px solid rgba(27,26,23,.12)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Caveat',cursive", fontSize: 30, color: "#5b4708", transform: "rotate(-2deg)" }}>
            Apprendre · Partager · Agir
          </div>
          <h2
            className="rc-htitle"
            style={{
              margin: "12px 0 0",
              fontFamily: "'Anton',sans-serif",
              fontWeight: 400,
              textTransform: "uppercase",
              fontSize: "clamp(48px,9vw,104px)",
              lineHeight: 0.9,
              letterSpacing: "1px",
              color: "#1B1A17",
            }}
          >
            Nos activités
          </h2>
          <p style={{ margin: "16px 0 0", maxWidth: "46ch", fontSize: 18, lineHeight: 1.6, color: "#3a2f08" }}>
            Réapprendre à faire soi-même au naturel.
          </p>

          <div
            className="rc-circles"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "clamp(20px,4vw,48px)",
              margin: "clamp(20px,3vw,36px) auto 0",
              maxWidth: 980,
            }}
          >
            {[
              { href: "/la-zd-theque", label: "La ZD'thèque", fs: 26, txt: "Sessions gratuites zéro déchet & cosmétiques maison" },
              { href: "/le-lab", label: "Le LAB", fs: 30, txt: "Accompagnement des artisans & créateurs" },
              { href: "/nos-ateliers", label: "Les Ateliers\nd'Artisans", fs: 24, txt: "Les recettes & savoir-faire qu'on y fabrique" },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                className="dc-lift"
                style={{
                  textDecoration: "none",
                  color: "#1B1A17",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ position: "relative", width: 210, maxWidth: "60vw", aspectRatio: "1" }}>
                  <LogoCircle label={c.label} fontSize={c.fs} color="#1B1A17" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#3a2f08", textAlign: "center", maxWidth: "22ch" }}>
                  {c.txt}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ENGAGEMENTS ===================== */}
      <section
        id="engagements"
        style={{
          padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)",
          background: "#FFFFFF",
          borderTop: "1px solid rgba(27,26,23,.08)",
          borderBottom: "1px solid rgba(27,26,23,.08)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 8px" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#C9A227" }}>
              Nos engagements
            </div>
            <h2 style={{ margin: "10px 0 0", fontSize: "clamp(32px,4.4vw,52px)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-.5px" }}>
              Créateurs de liens
              <br />
              et d'autonomie
            </h2>
            <p style={{ margin: "16px auto 0", fontSize: 17, lineHeight: 1.6, color: "#6B675C", maxWidth: "44ch" }}>
              Chez les Daronnes, le savoir ne se garde pas : il se transmet de main en main.
            </p>
          </div>

          <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26, marginTop: 46 }}>
            <article style={{ position: "relative", background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: "240px 18px 220px 18px / 18px 220px 18px 240px", padding: "34px 30px 30px" }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 46, color: "#C9A227", lineHeight: 1 }}>01</div>
              <div style={{ margin: "12px 0 14px" }}><IconTransmission /></div>
              <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 30, lineHeight: 1 }}>La transmission du savoir-faire</h3>
              <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#4A463C" }}>
                <strong>Grand public —</strong> des ateliers pratiques et accessibles pour réapprendre les gestes de l'autonomie : cosmétiques naturels, produits ménagers sains, upcycling.
              </p>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#4A463C" }}>
                <strong>Professionnels —</strong> via <em>Le LAB</em>, notre équipe pluridisciplinaire coache artisans et créateurs pour concevoir et animer leurs propres ateliers.
              </p>
            </article>
            <article style={{ position: "relative", background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: "18px 220px 18px 240px / 240px 18px 220px 18px", padding: "34px 30px 30px" }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 46, color: "#C9A227", lineHeight: 1 }}>02</div>
              <div style={{ margin: "12px 0 14px" }}><IconPartage /></div>
              <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 30, lineHeight: 1 }}>Le partage équitable</h3>
              <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#4A463C" }}>
                Une écologie généreuse, qui fait du bien au portefeuille comme à la planète.
              </p>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#4A463C" }}>
                <strong>La ZD'thèque —</strong> des sessions gratuites d'entraide et de troc de connaissances, où l'on prend soin de nos objets, où l'on teste et où l'on crée ensemble, au local, sans aucun jugement.
              </p>
            </article>
            <article style={{ position: "relative", background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: "220px 18px 240px 18px / 18px 240px 18px 220px", padding: "34px 30px 30px" }}>
              <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 46, color: "#C9A227", lineHeight: 1 }}>03</div>
              <div style={{ margin: "12px 0 14px" }}><IconExperience /></div>
              <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 30, lineHeight: 1 }}>Vivre des expériences uniques</h3>
              <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#4A463C" }}>
                On retient 10&nbsp;% de ce qu'on lit, mais 90&nbsp;% de ce que l'on fait. Place à l'expérience concrète, sensorielle et humaine.
              </p>
              <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.6, color: "#4A463C" }}>
                Nos ateliers sont des bulles de déconnexion numérique, ancrées au cœur de notre région.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== SMD ===================== */}
      <section
        id="smd"
        style={{
          padding: "clamp(48px,6vw,96px) clamp(20px,5vw,56px)",
          background: "#1B1A17",
          color: "#FBF6E9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: "4%", opacity: 0.5 }}>
          <Sparkle size={120} color="#E8BE36" />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div className="rc-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,64px)", alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#E8BE36" }}>
                Notre politique SMD
              </div>
              <h2 style={{ margin: "12px 0 0", fontSize: "clamp(34px,4.6vw,56px)", lineHeight: 1, fontWeight: 600, letterSpacing: "-.5px" }}>
                Service
                <br />
                Minimum
                <br />
                Digital
              </h2>
              <p style={{ margin: "22px 0 0", fontSize: 17, lineHeight: 1.7, color: "rgba(251,246,233,.78)", maxWidth: "36ch" }}>
                En cohérence avec nos ateliers, on applique le numérique au strict nécessaire. Moins d'écrans, moins de données, plus d'humain.
              </p>
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: 30, color: "#E8BE36", marginTop: 22, transform: "rotate(-2deg)" }}>
                « Le meilleur octet est celui qu'on n'envoie pas. »
              </div>
            </div>
            <div className="rc-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: <IconMailGold />, title: "Sobriété des échanges", text: "Priorité aux circuits courts : une newsletter mensuelle plutôt que dix mails." },
                { icon: <IconFileGold />, title: "Légèreté des fichiers", text: "Documents compressés et liens éphémères plutôt que pièces jointes lourdes." },
                { icon: <IconBroomGold />, title: "Nettoyage régulier", text: "Campagnes annuelles de suppression des données inutiles sur notre cloud." },
                { icon: <IconLeafGold />, title: "Low-tech", text: "Sites web légers et éco-conçus, stockage vidéo HD limité au minimum." },
              ].map(card => (
                <div key={card.title} style={{ border: "1.5px solid rgba(232,190,54,.4)", borderRadius: 16, padding: "22px 20px", background: "rgba(232,190,54,.06)" }}>
                  <div style={{ marginBottom: 12 }}>{card.icon}</div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#E8BE36" }}>{card.title}</h4>
                  <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color: "rgba(251,246,233,.72)" }}>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== À PROPOS ===================== */}
      <section
        id="apropos"
        style={{
          padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)",
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(27,26,23,.08)",
        }}
      >
        <div
          className="rc-2"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: ".85fr 1.15fr",
            gap: "clamp(32px,5vw,64px)",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: "-10% -8% -14% -8%",
                background: "radial-gradient(60% 60% at 50% 55%, rgba(216,180,58,.55), rgba(216,180,58,0) 70%)",
                filter: "blur(28px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                background: "linear-gradient(160deg,#D8B43A,#C49C22)",
                borderRadius: "36px 60px 36px 60px / 60px 36px 60px 36px",
                aspectRatio: "4 / 5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 28px 56px -30px rgba(166,131,20,.6)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  border: "2px solid rgba(27,26,23,.25)",
                  borderRadius: "26px 50px 26px 50px / 50px 26px 50px 26px",
                  pointerEvents: "none",
                }}
              />
              <img
                src={equipe}
                alt="L'équipe des Daronnes en Nord"
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "92%",
                  height: "92%",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  filter: "drop-shadow(0 12px 20px rgba(27,26,23,.18))",
                }}
              />
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#C9A227" }}>
              À propos
            </div>
            <h2 style={{ margin: "10px 0 0", fontSize: "clamp(32px,4.4vw,52px)", lineHeight: 1.02, fontWeight: 600, letterSpacing: "-.5px" }}>
              Les Daronnes
              <br />
              en Nord
            </h2>
            <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.7, color: "#4A463C" }}>
              Nous transformons de grands enjeux écologiques en gestes simples, ludiques et conviviaux. Le passage à l'action n'est pas une contrainte, mais une occasion de mieux consommer, de faire des économies et de redécouvrir le plaisir du « faire soi-même ».
            </p>
            <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.7, color: "#4A463C" }}>
              Nos rendez-vous sont <strong>anonymes et sans jugement</strong> — à Lille, Villeneuve-d'Ascq, Lys-lez-Lannoy et partout dans la métropole.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              {["Apprendre", "Partager", "Agir"].map(t => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'Caveat',cursive",
                    fontSize: 22,
                    background: "#F3E7C2",
                    border: "1.5px solid #C9A227",
                    color: "#8a6c12",
                    padding: "4px 18px",
                    borderRadius: 40,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA BAND ===================== */}
      <section style={{ padding: "clamp(44px,5vw,80px) clamp(20px,5vw,56px)" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            background: "linear-gradient(150deg,#D8B43A,#C09A20)",
            borderRadius: 40,
            padding: "clamp(34px,5vw,60px)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <div style={{ position: "absolute", top: 18, left: 30, ["--r" as any]: "-8deg", animation: "floaty 6s ease-in-out infinite" }}>
            <Sparkle size={34} color="#1B1A17" />
          </div>
          <div style={{ position: "absolute", bottom: 20, right: 40, ["--r" as any]: "8deg", animation: "floaty 7s ease-in-out infinite .5s" }}>
            <Sparkle size={34} color="#1B1A17" />
          </div>
          <h2 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontSize: "clamp(40px,5.5vw,66px)", lineHeight: 1, color: "#1B1A17" }}>
            Venez pas les mains vides !
          </h2>
          <p style={{ margin: "12px auto 0", maxWidth: "50ch", fontSize: 17, lineHeight: 1.6, color: "#4a3c10" }}>
            Alimentez notre ZD'thèque avec vos petits trésors du quotidien comme des bocaux, des boîtes d'œufs, tissus en coton, tee-shirts, linge de maison, des journaux…
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
            <a href="/la-zd-theque#sessions" className="dc-btn dc-btn-dark" style={{ fontSize: 16, padding: "15px 30px" }}>
              Réserver un atelier gratuit
            </a>
            <a href="/la-zd-theque" className="dc-btn dc-btn-outline dc-btn-outline-fill" style={{ fontSize: 16, padding: "14px 30px" }}>
              Voir nos activités
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <>
    <title>Les Daronnes en Nord — Ateliers cosmétiques maison & zéro déchet à Lille</title>
    <meta
      name="description"
      content="Ateliers de cosmétiques maison et zéro déchet à Lille et dans la métropole lilloise, animés par Les Daronnes en Nord. Apprendre, partager, agir — au naturel."
    />
    <html lang="fr" />
  </>
)
