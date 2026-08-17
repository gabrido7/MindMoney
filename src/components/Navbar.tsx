import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 30px",
        backgroundColor: "#111827",
        color: "white",
      }}
    >
      <h2>FinMind</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>
      </div>
    </nav>
  )
}

export default Navbar