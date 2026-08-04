import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/PublicLayout.css";

function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <Navbar />
      <main className="public-layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;