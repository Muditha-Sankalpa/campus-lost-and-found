import Hero from "../components/Hero";
import AnnouncementBanner from "../components/AnnouncementBanner";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <AnnouncementBanner />
      <Hero />
    </div>
  );
}

export default Home;
