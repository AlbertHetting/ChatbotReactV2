import { Outlet } from "react-router";
import SideBar from "../components/sidebar";

export default function Layout() {
  return (
    <div className="app-layout">
      <SideBar/>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
