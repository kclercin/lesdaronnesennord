import * as React from "react"
import SiteHeader, { ActiveKey } from "./SiteHeader"
import SiteFooter from "./SiteFooter"

const Layout = ({
  active = "",
  children,
}: {
  active?: ActiveKey
  children: React.ReactNode
}) => (
  <div
    style={{
      background: "#FBF6E9",
      color: "#1B1A17",
      fontFamily: "'Poppins', sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative",
    }}
  >
    <SiteHeader active={active} />
    {children}
    <SiteFooter />
  </div>
)

export default Layout
