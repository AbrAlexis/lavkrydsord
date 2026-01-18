import "./Layout.css";
import logo from "../assets/logo.jpg";
import { Outlet, useNavigate } from "react-router-dom";
function Layout() {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/")}
          draggable={false}
        />
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
