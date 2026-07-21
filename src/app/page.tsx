"use client";

import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import Topes from "@/components/landing/Topes";
import Checklist from "@/components/landing/Checklist";
import UVT from "@/components/landing/UVT";
import Recomendaciones from "@/components/landing/Recomendaciones";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <Hero />
      <Topes />
      <Checklist />
      <UVT />
      <Recomendaciones />
      <Footer />
    </>
  );
}
