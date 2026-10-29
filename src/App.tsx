import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import type { Project, SectionId } from "@/types";
import { PreferencesProvider } from "@/features/customization/PreferencesContext";
import { usePreferences } from "@/features/customization/usePreferences";
import type { LoadedPreferences } from "@/features/customization/preferences";
import { CustomizationPanel } from "@/features/customization/CustomizationPanel";
import { Navbar } from "@/features/navigation/Navbar";
import { BackToTop } from "@/features/navigation/BackToTop";
import { BackgroundLayers } from "@/components/BackgroundLayers";
import { Footer } from "@/components/Footer";
import { ProjectDetailDialog } from "@/features/projects/ProjectDetailDialog";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { FeaturedProjects } from "@/sections/FeaturedProjects";
import { ArchiveSection } from "@/sections/ArchiveSection";
import { Experience } from "@/sections/Experience";
import { Education } from "@/sections/Education";
import { Achievements } from "@/sections/Achievements";
import { Contact } from "@/sections/Contact";

function renderSection(id: SectionId, openDetails: (p: Project) => void): ReactNode {
  switch (id) {
    case "hero":
      return <Hero />;
    case "about":
      return <About />;
    case "skills":
      return <Skills />;
    case "projects":
      return <FeaturedProjects onOpenDetails={openDetails} />;
    case "archive":
      return <ArchiveSection onOpenDetails={openDetails} />;
    case "experience":
      return <Experience />;
    case "education":
      return <Education />;
    case "achievements":
      return <Achievements />;
    case "contact":
      return <Contact />;
  }
}

interface AppProps {
  initialPreferences: LoadedPreferences;
}

export function App({ initialPreferences }: AppProps) {
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const openDetails = useCallback((p: Project) => setSelectedProject(p), []);
  const closeDetails = useCallback(() => setSelectedProject(null), []);

  return (
    <MotionConfig reducedMotion="user">
      <PreferencesProvider initial={initialPreferences}>
        <BackgroundLayers />
        <a href="#about" className="skip-link">
          Skip to content
        </a>
        <NavbarConsumer onOpenCustomize={() => setCustomizeOpen(true)} />
        <SectionConsumer openDetails={openDetails} />
        <Footer />
        <BackToTop />
        <CustomizationPanel open={customizeOpen} onClose={() => setCustomizeOpen(false)} />
        <ProjectDetailDialog project={selectedProject} onClose={closeDetails} />
      </PreferencesProvider>
    </MotionConfig>
  );
}

function NavbarConsumer({ onOpenCustomize }: { onOpenCustomize: () => void }) {
  const { preferences } = usePreferences();
  return <Navbar sectionOrder={preferences.sectionOrder} onOpenCustomize={onOpenCustomize} />;
}

function SectionConsumer({ openDetails }: { openDetails: (p: Project) => void }) {
  const { preferences } = usePreferences();
  return (
    <main>
      {preferences.sectionOrder.map((id) => (
        <div key={id}>{renderSection(id, openDetails)}</div>
      ))}
    </main>
  );
}
