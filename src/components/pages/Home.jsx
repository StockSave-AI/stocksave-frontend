import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import CTA from "../sections/CTA";
import Hero from "../sections/Hero";
import HowItWorks from "../sections/HowItWorks";
import OurFeatures from "../sections/OurFeatures";
import Pricing from "../sections/Pricing";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <OurFeatures />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
