import { PreferencesProvider, usePreferences } from "@/contexts/PreferencesContext";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";

function IndexContent() {
  const { hasCompleted } = usePreferences();
  return hasCompleted ? <Dashboard /> : <Onboarding />;
}

const Index = () => (
  <PreferencesProvider>
    <BookmarksProvider>
      <IndexContent />
    </BookmarksProvider>
  </PreferencesProvider>
);

export default Index;
