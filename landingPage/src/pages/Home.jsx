import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import HowItWorks from '../components/Home/HowItWorks';
import Testimonials from '../components/Home/Testimonials';
import CTA from '../components/Home/CTA';
import Footer from '../components/Navigation/Footer';
import Navbar from "../components/Navigation/Navbar";
const Home = () => {
  return (
    <>
    <Navbar />
    <main className="pt-6 overflow-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
    <Footer />
    </>
  );
};

export default Home;
