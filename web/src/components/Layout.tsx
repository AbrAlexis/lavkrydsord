import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
function Layout() {
  const navigate = useNavigate();
  return (
    <>
      <div className="logo">
        <h1 onClick={() => navigate("/")}>Lav Krydsord</h1>
      </div>
      <Outlet />
    </>
  );
}

export default Layout;
