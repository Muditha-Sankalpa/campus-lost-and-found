import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Hero from "../components/Hero";
import AnnouncementBanner from "../components/AnnouncementBanner";
import "../styles/Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "moderator") {
      navigate("/moderator", { replace: true });
    }
  }, [user, navigate]);

  if (user?.role === "moderator") return null;

  return (
    <div className="home">
      <AnnouncementBanner />
      <Hero />
    </div>
  );
}

export default Home;
