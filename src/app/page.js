import Hero from "@/components/Hero";
import LuxuryMessageCarousel from "@/components/LuxuryMessageCarousel";
import InstantGlam from "@/components/InstantGlam";
import Comments from "@/components/Comments";
import BestSellingStyles from "@/components/BestSellingStyles";
import UsVsThemSection from "@/components/usvsthem";
import TwoSquares from "@/components/TwoSquares";

export default function Home() {
  return (
    <>
      <Hero />
      <LuxuryMessageCarousel />
      <InstantGlam />
      <UsVsThemSection />
      <TwoSquares />
      <BestSellingStyles />
      <Comments />
      
    </>
  );
}
