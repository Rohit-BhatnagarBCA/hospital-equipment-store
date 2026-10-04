/*
 * Home Page
 * -------------------------------------------------------
 * Main landing page for the Medical Sales Intelligence
 * application.
 *
 * The page is composed using separate reusable components
 * so each section can be developed and maintained
 * independently.
 */

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";

import OfferCarousel from "../components/Home/OfferCarousel";
import CategorySection from "../components/Home/CategorySection";
import ProductSection from "../components/Products/ProductSection";

import Footer from "../components/shared/Footer";


function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Global website navigation */}
      <Navbar />

      <main>

        {/* Main promotional carousel */}
        <OfferCarousel />

        {/* Medical equipment categories */}
        <CategorySection />

        {/* Featured medical products */}
        <ProductSection />

      </main>

      {/* Floating AI Agent available across the website */}
      <AiAgent />

      {/* Global website footer */}
      <Footer />

    </div>
  );
}

export default Home;