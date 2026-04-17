import { Metadata } from "next";
import HeroSection from "@/components/store/HeroSection";
import CategoryStrip from "@/components/store/CategoryStrip";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import NewArrivalsBanner from "@/components/store/NewArrivalsBanner";
import TrustMarquee from "@/components/store/TrustMarquee";
import FooterStore from "@/components/store/FooterStore";

export const metadata: Metadata = {
  title: "Kido Studio — Editorial Kids Fashion",
  description:
    "Shop curated kids clothing — cool, clean and effortlessly stylish. Boys, girls, infants. Free delivery over ₹1499.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <FeaturedProducts />
      <NewArrivalsBanner />
      <TrustMarquee />
      <FooterStore />
    </>
  );
}
