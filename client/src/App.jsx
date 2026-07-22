import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ReportItem from "./pages/ReportItem";
import BrowseItems from "./pages/BrowsItems";
import MyItems from "./pages/MyItems";

function App() {
  return (
    <div className="app">
      {/* Header, Navbar, Footer stay on every page — only the routed content changes */}
      <Header />
      <Navbar />

      <main className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/browse" element={<BrowseItems />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
