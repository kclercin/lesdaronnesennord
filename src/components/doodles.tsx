import * as React from "react"

/* Doodles & icônes dessinés à la main — repris fidèlement du projet Claude Design.
   Tous les tracés/viewBox sont conservés à l'identique. */

const INK = "#1B1A17"
const GOLD = "#E8BE36"

type StrokeProps = {
  fill: "none"
  stroke: string
  strokeWidth: number
  strokeLinecap: "round"
  strokeLinejoin: "round"
}

const s = (w: number, c: string = INK): StrokeProps => ({
  fill: "none",
  stroke: c,
  strokeWidth: w,
  strokeLinecap: "round",
  strokeLinejoin: "round",
})

/* ---------- étoile / "crown" (même forme dans tout le design) ---------- */
export const Sparkle = ({
  size = 26,
  color = GOLD,
}: {
  size?: number
  color?: string
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M2.6 8.2 6.7 11.6 12 3.8 17.3 11.6 21.4 8.2 19.6 19.4 4.4 19.4 2.6 8.2Z"
      fill={color}
    />
    <circle cx={2.6} cy={7} r={1.5} fill={color} />
    <circle cx={12} cy={2.4} r={1.5} fill={color} />
    <circle cx={21.4} cy={7} r={1.5} fill={color} />
  </svg>
)

/* ---------- trio de flacons cosmétiques (hero accueil) ---------- */
export const Bottles = ({ scale = 1 }: { scale?: number }) => (
  <svg width={340 * scale} height={300 * scale} viewBox="0 0 340 300" aria-hidden="true">
    <rect x={30} y={108} width={92} height={156} rx={22} {...s(7)} />
    <rect x={62} y={80} width={30} height={30} {...s(7)} />
    <rect x={54} y={54} width={46} height={26} rx={6} {...s(7)} />
    <path d="M54 62 H30 v14" {...s(7)} />
    <rect x={132} y={150} width={66} height={114} rx={26} {...s(7)} />
    <rect x={150} y={126} width={30} height={26} rx={5} {...s(7)} />
    <rect x={196} y={196} width={120} height={68} rx={16} {...s(7)} />
    <rect x={192} y={176} width={128} height={26} rx={8} {...s(7)} />
  </svg>
)

/* ---------- plante en pot (hero accueil) ---------- */
export const Plant = () => (
  <svg width={150} height={185} viewBox="0 0 150 185" aria-hidden="true">
    <path d="M75 128 C75 104 74 88 75 66" {...s(3)} />
    <path d="M73 130 C62 112 52 100 44 86" {...s(3)} />
    <path d="M77 130 C88 112 98 102 106 88" {...s(3)} />
    <path d="M75 66 C65 52 65 36 75 22 C85 36 85 52 75 66 Z" {...s(3.5)} />
    <path d="M75 60 V30" {...s(2.2)} />
    <path d="M44 86 C30 80 22 64 21 50 C37 54 50 66 55 82 Z" {...s(3.5)} />
    <path d="M44 84 L29 56" {...s(2.2)} />
    <path d="M106 88 C121 82 130 66 131 52 C115 56 102 68 97 84 Z" {...s(3.5)} />
    <path d="M106 86 L122 58" {...s(2.2)} />
    <path d="M36 120 H114 L108 133 H42 Z" {...s(3.5)} />
    <path d="M43 133 H107 L98 176 H52 Z" {...s(3.5)} />
  </svg>
)

/* ---------- cadre double-cercle façon logo, label centré ---------- */
export const LogoCircle = ({
  label,
  fontSize,
  color = INK,
}: {
  label: string
  fontSize: number
  color?: string
}) => (
  <svg viewBox="0 0 220 220" width="100%" height="100%" role="img" aria-label={label}>
    <path
      d="M110 18 C168 16 206 58 204 110 C206 164 162 206 110 204 C56 206 14 162 16 110 C14 58 54 20 110 18 Z"
      {...s(2.4, color)}
    />
    <path
      d="M110 28 C160 27 196 62 194 110 C196 156 158 196 110 194 C62 196 24 156 26 110 C24 64 62 29 110 28 Z"
      {...s(1.4, color)}
    />
    <circle cx={110} cy={17} r={2.4} fill={color} />
    <circle cx={110} cy={203} r={2.4} fill={color} />
    {(() => {
      const lines = label.split("\n")
      const lineHeight = fontSize * 1.02
      const startY = 118 - ((lines.length - 1) * lineHeight) / 2
      return (
        <text
          x={110}
          y={startY}
          textAnchor="middle"
          fontFamily="'Caveat', cursive"
          fontWeight={700}
          fontSize={fontSize}
          fill={color}
          letterSpacing="1px"
        >
          {lines.map((line, i) => (
            <tspan key={i} x={110} dy={i === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      )
    })()}
  </svg>
)

/* ======================= icônes ENGAGEMENTS (accueil) ======================= */
export const IconTransmission = () => (
  <svg width={38} height={38} viewBox="0 0 40 40">
    <circle cx={12} cy={13} r={5} {...s(2.4)} />
    <circle cx={28} cy={13} r={5} {...s(2.4)} />
    <path d="M4 32 c0 -7 4 -11 8 -11 c3 0 5 2 6 4" {...s(2.4)} />
    <path d="M36 32 c0 -7 -4 -11 -8 -11 c-3 0 -5 2 -6 4" {...s(2.4)} />
    <path d="M16 26 h8" {...s(2.4)} />
  </svg>
)
export const IconPartage = () => (
  <svg width={38} height={38} viewBox="0 0 40 40">
    <circle cx={10} cy={10} r={4} {...s(2.4)} />
    <circle cx={30} cy={10} r={4} {...s(2.4)} />
    <circle cx={20} cy={30} r={4} {...s(2.4)} />
    <path d="M13 12 17 27 M27 12 23 27" {...s(2.4)} />
  </svg>
)
export const IconExperience = () => (
  <svg width={38} height={38} viewBox="0 0 40 40">
    <path
      d="M20 6 c-7 0 -12 5 -12 12 c0 5 3 8 5 11 h14 c2 -3 5 -6 5 -11 c0 -7 -5 -12 -12 -12 Z"
      {...s(2.4)}
    />
    <path d="M14 33 h12 M16 37 h8" {...s(2.4)} />
  </svg>
)

/* ======================= icônes SMD (or, sur fond sombre) ======================= */
export const IconMailGold = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x={4} y={7} width={24} height={18} rx={3} {...s(2.2, GOLD)} />
    <path d="M5 9 16 18 27 9" {...s(2.2, GOLD)} />
  </svg>
)
export const IconFileGold = () => (
  <svg width={30} height={30} viewBox="0 0 32 32">
    <path d="M9 4 h11 l6 6 v18 a0 0 0 0 1 0 0 H9 Z" {...s(2.2, GOLD)} />
    <path d="M20 4 v6 h6" {...s(2.2, GOLD)} />
    <path d="M13 17 h8 M13 22 h8" {...s(2.2, GOLD)} />
  </svg>
)
export const IconBroomGold = () => (
  <svg width={30} height={30} viewBox="0 0 32 32">
    <path d="M22 5 13 16" {...s(2.2, GOLD)} />
    <path d="M8 27 c2 -8 5 -12 8 -13 l4 4 c-1 4 -4 8 -12 9 Z" {...s(2.2, GOLD)} />
    <path d="M12 21 16 25 M16 19 19 22" {...s(1.8, GOLD)} />
  </svg>
)
export const IconLeafGold = () => (
  <svg width={30} height={30} viewBox="0 0 32 32">
    <path d="M26 6 C14 6 7 13 7 24 C18 24 26 17 26 6 Z" {...s(2.2, GOLD)} />
    <path d="M10 22 22 10" {...s(2, GOLD)} />
  </svg>
)

/* ======================= icônes ateliers ZD (encre) ======================= */
export const IconCosmetic = () => (
  <svg width={46} height={46} viewBox="0 0 48 48">
    <rect x={14} y={18} width={20} height={24} rx={6} {...s(2.6)} />
    <rect x={20} y={10} width={8} height={8} rx={2} {...s(2.6)} />
    <path d="M18 28 h12" {...s(2.2)} />
  </svg>
)
export const IconSpray = () => (
  <svg width={46} height={46} viewBox="0 0 48 48">
    <rect x={16} y={18} width={16} height={24} rx={4} {...s(2.6)} />
    <path d="M16 18 v-4 h10 v4" {...s(2.6)} />
    <path d="M26 10 h8 M34 7 v6" {...s(2.4)} />
    <circle cx={38} cy={6} r={1.3} fill={INK} />
    <circle cx={41} cy={10} r={1.3} fill={INK} />
  </svg>
)
export const IconChalk = () => (
  <svg width={46} height={46} viewBox="0 0 48 48">
    <path d="M14 34 L30 12 l8 5 L22 39 Z" {...s(2.6)} />
    <path d="M14 34 l-2 6 l8 -1" {...s(2.4)} />
    <path d="M30 12 l8 5" {...s(2.2)} />
  </svg>
)
export const IconRecycle = () => (
  <svg width={46} height={46} viewBox="0 0 48 48">
    <path d="M24 10 l6 10 h-12 Z" {...s(2.6)} />
    <path d="M14 24 l-4 10 l11 1" {...s(2.6)} />
    <path d="M34 24 l4 10 l-11 1" {...s(2.6)} />
    <path d="M18 21 l-4 3 M30 21 l4 3 M19 36 h10" {...s(2.2)} />
  </svg>
)

/* ======================= icônes Le LAB (encre) ======================= */
export const IconLeafLab = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <path d="M40 8 C20 8 10 19 10 38 C29 38 40 27 40 8 Z" {...s(2.6)} />
    <path d="M16 34 34 14" {...s(2.2)} />
  </svg>
)
export const IconTools = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <path
      d="M30 8 a8 8 0 0 0 -8 13 L8 35 l5 5 14 -14 a8 8 0 0 0 13 -8 l-6 6 -5 -5 Z"
      {...s(2.6)}
    />
  </svg>
)
export const IconSpark = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <path
      d="M24 6 c1.5 11 6 15.5 18 18 c-12 2.5 -16.5 7 -18 18 c-1.5 -11 -6 -15.5 -18 -18 C18 21.5 22.5 17 24 6 Z"
      {...s(2.6)}
    />
  </svg>
)

/* ======================= icônes Nos ateliers (encre) ======================= */
export const IconRecipe = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <path d="M14 6 h14 l8 8 v28 H14 Z" {...s(2.6)} />
    <path d="M28 6 v8 h8" {...s(2.6)} />
    <path d="M19 24 h12 M19 30 h12 M19 36 h8" {...s(2.2)} />
  </svg>
)
export const IconKey = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <circle cx={16} cy={18} r={8} {...s(2.6)} />
    <path d="M22 24 L38 40 M34 36 l4 -4 M30 32 l4 -4" {...s(2.6)} />
  </svg>
)
export const IconFamily = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <circle cx={19} cy={17} r={6} {...s(2.4)} />
    <path d="M8 38 c0 -7 5 -11 11 -11 c6 0 11 4 11 11" {...s(2.4)} />
    <path d="M31 12 a6 6 0 0 1 0 11" {...s(2.4)} />
    <path d="M34 27 c5 1 8 5 8 11" {...s(2.4)} />
  </svg>
)
export const IconGender = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <circle cx={18} cy={18} r={9} {...s(2.4)} />
    <path d="M18 27 v13 M12 35 h12" {...s(2.4)} />
    <path d="M30 30 l9 -9 M33 21 h6 v6" {...s(2.4)} />
  </svg>
)
export const IconLevel = () => (
  <svg width={40} height={40} viewBox="0 0 48 48">
    <path d="M10 40 V28 M22 40 V20 M34 40 V12" {...s(3)} />
    <path d="M6 40 h36" {...s(2.4)} />
  </svg>
)

/* ======================= icônes Nos ateliers (or, sur fond sombre) ======================= */
export const IconPro = () => (
  <svg width={34} height={34} viewBox="0 0 40 40">
    <rect x={7} y={14} width={26} height={18} rx={3} {...s(2.2, GOLD)} />
    <path d="M15 14 v-4 h10 v4" {...s(2.2, GOLD)} />
    <path d="M7 22 h26" {...s(2, GOLD)} />
  </svg>
)
export const IconCycle = () => (
  <svg width={34} height={34} viewBox="0 0 40 40">
    <path d="M11 14 a12 12 0 0 1 19 -2" {...s(2.2, GOLD)} />
    <path d="M29 26 a12 12 0 0 1 -19 2" {...s(2.2, GOLD)} />
    <path d="M30 6 v6 h-6 M10 34 v-6 h6" {...s(2.2, GOLD)} />
  </svg>
)
export const IconImpact = () => (
  <svg width={34} height={34} viewBox="0 0 40 40">
    <path
      d="M20 33 C8 24 6 17 10 13 c3 -3 8 -2 10 2 c2 -4 7 -5 10 -2 c4 4 2 11 -10 20 Z"
      {...s(2.2, GOLD)}
    />
  </svg>
)

/* ======================= icônes Contact (or, ligne) ======================= */
export const IconMailLine = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <rect x={4} y={7} width={24} height={18} rx={3} {...s(2.2, GOLD)} />
    <path d="M5 9 16 18 27 9" {...s(2.2, GOLD)} />
  </svg>
)
export const IconGlobe = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx={16} cy={16} r={11} {...s(2.2, GOLD)} />
    <path d="M5 16 H27 M16 5 c5 4 5 18 0 22 c-5 -4 -5 -18 0 -22" {...s(2, GOLD)} />
  </svg>
)
export const IconPin = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path
      d="M16 28 c7 -8 10 -13 10 -18 a10 10 0 1 0 -20 0 c0 5 3 10 10 18 Z"
      {...s(2.2, GOLD)}
    />
    <circle cx={16} cy={11} r={3.5} {...s(2.2, GOLD)} />
  </svg>
)

/* ---------- logo de marque ---------- */
/* Recréé en SVG : le PNG source du projet dépassait la limite de récupération (256 KiB).
   Motif fidèle à l'univers de la marque (double-cercle + étoile + wordmark Anton/Caveat).
   Monochrome pour s'inverser proprement (encre en header, crème en footer). */
export const Logo = ({
  height = 54,
  color = INK,
}: {
  height?: number
  color?: string
}) => (
  <svg
    height={height}
    viewBox="0 0 316 96"
    role="img"
    aria-label="Les Daronnes en Nord"
    style={{ display: "block", width: "auto" }}
  >
    <circle cx={46} cy={48} r={38} {...s(2.6, color)} />
    <circle cx={46} cy={48} r={31} {...s(1.4, color)} />
    <circle cx={46} cy={9} r={2.4} fill={color} />
    <circle cx={46} cy={87} r={2.4} fill={color} />
    <g transform="translate(30 32) scale(1.35)">
      <path
        d="M2.6 8.2 6.7 11.6 12 3.8 17.3 11.6 21.4 8.2 19.6 19.4 4.4 19.4 2.6 8.2Z"
        fill={color}
      />
      <circle cx={2.6} cy={7} r={1.5} fill={color} />
      <circle cx={12} cy={2.4} r={1.5} fill={color} />
      <circle cx={21.4} cy={7} r={1.5} fill={color} />
    </g>
    <text
      x={98}
      y={45}
      fontFamily="'Anton', sans-serif"
      fontSize={31}
      fill={color}
      letterSpacing="0.5px"
    >
      LES DARONNES
    </text>
    <text
      x={100}
      y={82}
      fontFamily="'Caveat', cursive"
      fontWeight={700}
      fontSize={34}
      fill={color}
    >
      en Nord
    </text>
  </svg>
)
