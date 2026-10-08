import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Tracks from "../components/Tracks.jsx";
import Timeline from "../components/Timeline.jsx";
import Prizes from "../components/Prizes.jsx";
import RefreshmentPartner from "../components/RefreshmentPartner.jsx";
import RegisterCta from "../components/RegisterCta.jsx";
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Hero />
      <About />
      <Tracks />
      <Timeline />
      <Prizes />
      <RefreshmentPartner />
      <RegisterCta />
      <Footer />
    </div>
  );
}
