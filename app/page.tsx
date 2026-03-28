import ConvergenceSection from "./components/ConvergenceSection";
import ExperienceSection from "./components/ExperienceSection";
import HeroSection from "./components/HeroSection";
import ManifestoSection from "./components/ManifestoSection";
import ProblemSection from "./components/ProblemSection";
import TechnologySection from "./components/TechnologySection";

const page = () => {
  return (
    <main>
      <HeroSection />
      <ProblemSection />
      <TechnologySection />
      <ExperienceSection />
      <ManifestoSection />
      <ConvergenceSection />
    </main>
  );
};

export default page;
