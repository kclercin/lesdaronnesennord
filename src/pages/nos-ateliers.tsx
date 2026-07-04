import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"
import {
  Sparkle,
  LogoCircle,
  IconPro,
  IconCycle,
  IconImpact,
  IconCosmetic,
  IconRecipe,
  IconKey,
  IconFamily,
  IconGender,
  IconLevel,
} from "../components/doodles"
import imgSolides from "../images/atelier-cosmetiques-solides.webp"
import imgRouges from "../images/atelier-rouges-a-levres.webp"
import imgCreme from "../images/atelier-creme-de-jour.webp"

type Step = { n: string; title: string; text: string }
type Atelier = {
  id: number
  num: string
  title: string
  desc: string
  img: string
  imgAlt: string
  imageSide: "left" | "right"
  tags: string[]
  repartez: string[]
  deroule: Step[]
  derouleCols: 2 | 3
}

const cercle = [
  { icon: <IconPro />, title: "Les prestations pro", text: "Team-buildings, formations de créateurs via Le LAB et ateliers payants grand public — une expertise de haut niveau." },
  { icon: <IconCycle />, title: "Le cercle vertueux", text: "Ces revenus financent les matières premières, l'entretien du local, nos activités bénévoles et la vie de l'association." },
  { icon: <IconImpact />, title: "L'impact social", text: "En choisissant nos prestations payantes, vous devenez acteur direct de la transition et de la solidarité sur notre territoire." },
]

const transmission = [
  { icon: <IconCosmetic />, title: "Vos créations", text: "Vous repartez avec vos produits faits maison, personnalisés selon votre peau et vos envies.", radius: "240px 18px 220px 18px / 18px 220px 18px 240px" },
  { icon: <IconRecipe />, title: "Les fiches recettes", text: "Au format SMD ultra-léger, pour refaire vos recettes sans surcharge numérique.", radius: "18px 220px 18px 240px / 240px 18px 220px 18px" },
  { icon: <IconKey />, title: "Les clés de l'autonomie", text: "Gestes, dosages et bons réflexes pour continuer en toute autonomie, à la maison.", radius: "220px 18px 240px 18px / 18px 240px 18px 220px" },
]

const pourTous = [
  { icon: <IconFamily />, title: "De 7 à 107 ans", text: "Des formats ludiques en famille pour les petits, et des sessions pour approfondir pour les grands." },
  { icon: <IconGender />, title: "Femmes ET hommes", text: "Prendre soin de soi n'a pas de genre : baumes à barbe, déodorants solides, soins du visage…" },
  { icon: <IconLevel />, title: "Du novice à l'expert", text: "Jamais touché une balance de précision ? On reprend les bases. Déjà initié ? On vous challenge." },
]

const ATELIERS: Atelier[] = [
  {
    id: 1,
    num: "Atelier nº 1",
    title: "Créez vos cosmétiques solides",
    desc: "Découvrez la cosmétique home made, naturelle et écoresponsable en compagnie d'Audrey, créatrice de cosmétiques naturels à Villeneuve-d'Ascq. Elle vous ouvre les portes de son charmant atelier, où vous concevez vos propres soins solides.",
    img: imgSolides,
    imgAlt: "Atelier de fabrication de cosmétiques solides avec Audrey",
    imageSide: "left",
    tags: ["2 h", "Dès 8 ans", "1 à 8 participants", "Jusqu'à 20 en privatisation"],
    repartez: [
      "2 h de découverte avec Audrey pour réaliser 2 cosmétiques solides",
      "Des connaissances en fabrication de cosmétiques",
      "Votre duo de cosmétiques solides personnalisés",
    ],
    deroule: [
      { n: "01", title: "Accueil & introduction", text: "Audrey vous présente les ingrédients naturels — kératine végétale, poudres de plantes, huiles, beurres, fragrances — leurs rôles et leurs vertus." },
      { n: "02", title: "Choix des recettes", text: "Sélectionnez deux produits parmi shampoing, après-shampoing, dentifrice, déodorant, démaquillant, baume corporel ou savon. Audrey vous aide à personnaliser votre formule." },
      { n: "03", title: "Fabrication", text: "Testez, mesurez, mélangez et ajustez vos ingrédients jusqu'à une recette qui vous ressemble : parfum, texture, propriétés." },
      { n: "04", title: "Finalisation & échanges", text: "Recevez un livret pédagogique numérique avec les recettes, puis échangez autour d'une boisson. Repartez avec vos deux cosmétiques solides." },
    ],
    derouleCols: 2,
  },
  {
    id: 2,
    num: "Atelier nº 2",
    title: "Réalisez votre duo de rouges à lèvres",
    desc: "Révélez votre beauté au naturel en compagnie d'Audrey, créatrice de cosmétiques naturels à Villeneuve-d'Ascq. Plongez dans l'univers fascinant de la fabrication de cosmétiques et créez vos propres rouges à lèvres.",
    img: imgRouges,
    imgAlt: "Duo de rouges à lèvres naturels en étui bambou",
    imageSide: "right",
    tags: ["2 h", "Dès 15 ans", "1 à 6 participants", "Jusqu'à 20 en privatisation"],
    repartez: [
      "2 h de découverte avec Audrey pour réaliser deux rouges à lèvres",
      "Des connaissances en fabrication de cosmétiques",
      "Votre duo de rouges à lèvres (version vegan possible)",
    ],
    deroule: [
      { n: "01", title: "Accueil & introduction", text: "Audrey vous présente le rôle, les propriétés et les vertus de chaque ingrédient, et comment chaque matière contribue à la texture et à la couleur." },
      { n: "02", title: "Choix des teintes & fabrication", text: "Sélectionnez vos teintes parmi une large gamme, puis fabriquez votre duo de rouges à lèvres — en version vegan si vous le souhaitez." },
      { n: "03", title: "Accompagnement & astuces", text: "Audrey partage ses astuces, ses bons plans et ses conseils pour un mode de vie plus respectueux de vous-même et de votre environnement." },
      { n: "04", title: "Moment de partage", text: "Partagez votre expérience autour d'un verre, puis repartez avec vos jolis rouges à lèvres prêts à rejoindre votre routine beauté." },
    ],
    derouleCols: 2,
  },
  {
    id: 3,
    num: "Atelier nº 3",
    title: "Créez votre crème de jour",
    desc: "Plongez dans l'univers naturel et bienveillant d'Audrey, fabricante de cosmétiques à Villeneuve-d'Ascq. Entrez dans le monde fascinant de la fabrication de cosmétiques et composez votre propre crème de jour, sur mesure.",
    img: imgCreme,
    imgAlt: "Fabrication d'une crème de jour naturelle en atelier",
    imageSide: "left",
    tags: ["2 h", "Dès 8 ans", "1 à 8 participants", "Jusqu'à 20 en privatisation"],
    repartez: [
      "2 h de découverte avec Audrey pour réaliser 2 crèmes de jour",
      "Des connaissances en fabrication de cosmétiques",
      "Votre crème de jour naturelle et sur mesure",
    ],
    deroule: [
      { n: "01", title: "Accueil & introduction", text: "Audrey présente les ingrédients, leurs rôles et leurs bienfaits, et comment les associer : crème de jour, de nuit, lait corps, soin des mains… Des recettes pour tous, femmes comme hommes, selon votre type de peau." },
      { n: "02", title: "Réalisation", text: "Réalisez deux produits de 50 ml, en choisissant parmi une grande variété de principes actifs : vitamine E, acide hyaluronique, coenzyme Q10…" },
      { n: "03", title: "Fragrances & poudres", text: "Sélectionnez vos fragrances et poudres minérales pour la texture et le parfum idéal. Repartez avec vos cosmétiques, vos recettes et l'envie de continuer chez vous." },
    ],
    derouleCols: 3,
  },
]

const Media = ({ a }: { a: Atelier }) => (
  <div className="rc-atelier-media" style={{ position: "relative", minHeight: 280 }}>
    <img src={a.img} alt={a.imgAlt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  </div>
)

const AtelierCard = ({
  a,
  open,
  onToggle,
}: {
  a: Atelier
  open: boolean
  onToggle: () => void
}) => {
  const textCol = (
    <div style={{ padding: "clamp(26px,3vw,40px)" }}>
      <div style={{ fontFamily: "'Caveat',cursive", fontSize: 28, color: "#B8911E", lineHeight: 1, transform: "rotate(-1deg)" }}>{a.num}</div>
      <h3 style={{ margin: "8px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(28px,3.4vw,40px)", lineHeight: 1.1, letterSpacing: ".5px" }}>{a.title}</h3>
      <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.65, color: "#4A463C" }}>{a.desc}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
        {a.tags.map((t, i) => (
          <span
            key={t}
            style={
              i === 0
                ? { fontSize: 13, fontWeight: 600, background: "#1B1A17", color: "#E8BE36", padding: "6px 14px", borderRadius: 30 }
                : { fontSize: 13, fontWeight: 600, background: "#FFFFFF", color: "#1B1A17", border: "1.5px solid #1B1A17", padding: "6px 14px", borderRadius: 30 }
            }
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(27,26,23,.14)" }}>
        <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "2px", fontSize: 12, color: "#C9A227", marginBottom: 10 }}>Vous repartez avec</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {a.repartez.map(r => (
            <li key={r} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.45, color: "#4A463C" }}>
              <span style={{ flex: "none" }}><Sparkle size={15} color="#C9A227" /></span>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <article style={{ marginTop: a.id === 1 ? 44 : 28, background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: 28, overflow: "hidden" }}>
      <div className="rc-2" style={{ display: "grid", gridTemplateColumns: a.imageSide === "left" ? "1fr 1.1fr" : "1.1fr 1fr", gap: 0 }}>
        {a.imageSide === "left" ? (
          <>
            <Media a={a} />
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            <Media a={a} />
          </>
        )}
      </div>

      {/* Déroulé */}
      <div style={{ padding: "clamp(16px,1.8vw,22px) clamp(26px,3vw,40px)", borderTop: "2.5px solid #1B1A17", background: "#FFFFFF" }}>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="dc-btn dc-btn-outline dc-btn-outline-fill"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, padding: "12px 22px" }}
        >
          {open ? "Masquer le déroulé" : "Voir le déroulé de l'atelier"}
        </button>
        {open && (
          <>
            <div style={{ marginTop: 26, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 30, lineHeight: 1, marginBottom: 22 }}>Le déroulé de l'atelier</div>
            <div className={a.derouleCols === 3 ? "rc-3" : "rc-2"} style={{ display: "grid", gridTemplateColumns: a.derouleCols === 3 ? "repeat(3,1fr)" : "1fr 1fr", gap: 22 }}>
              {a.deroule.map(step => (
                <div key={step.n} style={{ display: "flex", gap: 16 }}>
                  <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 34, color: "#C9A227", lineHeight: 0.9, flex: "none" }}>{step.n}</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{step.title}</h4>
                    <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: "#4A463C" }}>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <a href="/contact#form" className="dc-btn dc-btn-dark" style={{ display: "inline-block", marginTop: 26, fontSize: 15, padding: "13px 26px" }}>
          Réserver cet atelier
        </a>
      </div>
    </article>
  )
}

const NosAteliersPage = () => {
  const [open, setOpen] = React.useState<Record<number, boolean>>({ 1: false, 2: false, 3: false })
  const toggle = (n: number) => setOpen(s => ({ ...s, [n]: !s[n] }))

  return (
    <Layout active="ateliers">
      {/* ===================== HERO ===================== */}
      <section style={{ padding: "clamp(40px,6vw,80px) clamp(20px,5vw,56px) clamp(48px,6vw,84px)", background: "#FBF6E9", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
        <div className="rc-2" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "clamp(28px,5vw,60px)", alignItems: "center" }}>
          <div>
            <div style={{ width: "min(450px,100%)", aspectRatio: "1", margin: "0 auto" }}>
              <LogoCircle label={"Nos ateliers\nartisans"} fontSize={26} color="#1B1A17" />
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: 34, color: "#B8911E", transform: "rotate(-1deg)", lineHeight: 1 }}>Formulez au naturel&nbsp;!</div>
            <h1 className="rc-htitle" style={{ margin: "6px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(50px,8vw,96px)", lineHeight: 0.9, letterSpacing: ".5px", color: "#1B1A17" }}>Nos ateliers artisans</h1>
            <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.7, color: "#4A463C", maxWidth: "46ch" }}>
              Envie de découvrir un savoir-faire, de vous initier à une pratique et de passer un moment unique. <strong>Glissez-vous dans la peau d'un artisan</strong> le temps d'un atelier&nbsp;!
            </p>
            <a href="/contact#form" className="dc-btn dc-btn-dark" style={{ display: "inline-block", marginTop: 26, fontWeight: 700, fontSize: 16, padding: "15px 30px" }}>Réserver un atelier</a>
          </div>
        </div>
      </section>

      {/* ===================== CERCLE VERTUEUX ===================== */}
      <section style={{ padding: "clamp(48px,6vw,96px) clamp(20px,5vw,56px)", background: "#1B1A17", color: "#FBF6E9", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: "5%", ["--r" as any]: "8deg", animation: "floaty 7s ease-in-out infinite" }}>
          <Sparkle size={96} color="rgba(232,190,54,.5)" />
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#E8BE36" }}>Un achat plaisir, un acte solidaire</div>
            <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1, color: "#E8BE36" }}>Le cercle vertueux des Daronnes</h2>
            <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.7, color: "rgba(251,246,233,.78)" }}>
              Nous croyons en une écologie accessible à tous. Pour que le budget ne soit jamais un frein, nous avons mis en place un modèle économique circulaire et solidaire.
            </p>
          </div>
          <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 40 }}>
            {cercle.map(c => (
              <div key={c.title} style={{ border: "1.5px solid rgba(232,190,54,.4)", borderRadius: 18, padding: "26px 24px", background: "rgba(232,190,54,.06)" }}>
                <div style={{ marginBottom: 12 }}>{c.icon}</div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#E8BE36" }}>{c.title}</h3>
                <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "rgba(251,246,233,.74)" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRANSMISSION ===================== */}
      <section style={{ padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)", background: "#FFFFFF", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#C9A227" }}>Repartez autonome</div>
            <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1 }}>Nos secrets de fabrication, transmis</h2>
            <p style={{ margin: "14px auto 0", fontSize: 17, lineHeight: 1.6, color: "#6B675C", maxWidth: "52ch" }}>
              On vous transmet nos recettes pour créer des produits sains, efficaces et zéro déchet. Vous repartez avec vos créations personnalisées et toutes les clés pour recommencer chez vous.
            </p>
          </div>
          <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 44 }}>
            {transmission.map(c => (
              <article key={c.title} style={{ background: "#FBF6E9", border: "2.5px solid #1B1A17", borderRadius: c.radius, padding: "32px 28px" }}>
                <div style={{ marginBottom: 14 }}>{c.icon}</div>
                <h3 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: 27, lineHeight: 1 }}>{c.title}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#4A463C" }}>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POUR TOUS ===================== */}
      <section style={{ padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)", background: "#FBF6E9", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Caveat',cursive", fontSize: 32, color: "#B8911E", transform: "rotate(-2deg)", lineHeight: 1 }}>Oui, absolument tous&nbsp;!</div>
            <h2 style={{ margin: "8px 0 0", fontFamily: "'Anton',sans-serif", textTransform: "uppercase", fontWeight: 400, fontSize: "clamp(30px,4vw,46px)", lineHeight: 1, letterSpacing: ".5px" }}>Un atelier pour tous</h2>
            <p style={{ margin: "14px auto 0", fontSize: 17, lineHeight: 1.6, color: "#6B675C", maxWidth: "50ch" }}>
              Nos ateliers sont des espaces de partage bienveillants où chacun trouve sa place.
            </p>
          </div>
          <div className="rc-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginTop: 44 }}>
            {pourTous.map(c => (
              <article key={c.title} style={{ background: "#FFFFFF", border: "2px solid #1B1A17", borderRadius: 22, padding: "30px 26px" }}>
                <div style={{ marginBottom: 14 }}>{c.icon}</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{c.title}</h3>
                <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "#4A463C" }}>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NOS ATELIERS À LA CARTE ===================== */}
      <section id="ateliers" style={{ padding: "clamp(48px,6vw,90px) clamp(20px,5vw,56px)", background: "#FFFFFF", borderBottom: "1px solid rgba(27,26,23,.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Anton',sans-serif", textTransform: "uppercase", letterSpacing: "3px", fontSize: 15, color: "#C9A227" }}>Nos ateliers à la carte</div>
            <h2 style={{ margin: "10px 0 0", fontFamily: "'Caveat',cursive", fontWeight: 600, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1 }}>Choisissez votre atelier</h2>
          </div>
          {ATELIERS.map(a => (
            <AtelierCard key={a.id} a={a} open={!!open[a.id]} onToggle={() => toggle(a.id)} />
          ))}
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
          <h2 style={{ margin: 0, fontFamily: "'Caveat',cursive", fontSize: "clamp(40px,5.5vw,64px)", lineHeight: 1, color: "#1B1A17" }}>Prêt(e) à formuler avec nous&nbsp;?</h2>
          <p style={{ margin: "12px auto 0", maxWidth: "42ch", fontSize: 17, lineHeight: 1.6, color: "#4a3c10" }}>
            Réservez votre atelier cosmétique ou parlez-nous de votre projet de team-building.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
            <a href="/contact#form" className="dc-btn dc-btn-dark" style={{ fontSize: 16, padding: "15px 30px" }}>Réserver un atelier</a>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default NosAteliersPage

export const Head: HeadFC = () => (
  <>
    <title>Nos ateliers cosmétiques — Créez vos soins au naturel | Les Daronnes en Nord</title>
    <meta
      name="description"
      content="Ateliers cosmétiques à Villeneuve-d'Ascq : cosmétiques solides, rouges à lèvres et crème de jour faits maison avec Audrey. Repartez avec vos créations et vos recettes."
    />
    <html lang="fr" />
  </>
)
