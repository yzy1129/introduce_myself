import { HeroSection } from "@/sections/HeroSection";

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="app-main app-main-home">
      <HeroSection />
    </main>
  );
}
