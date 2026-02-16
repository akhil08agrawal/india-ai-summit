import { PreferencesProvider, usePreferences } from "@/contexts/PreferencesContext";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";

function IndexContent() {
  const { hasCompleted } = usePreferences();
  return hasCompleted ? <Dashboard /> : <Onboarding />;
}

const Index = () => (
  <PreferencesProvider>
    <IndexContent />
  </PreferencesProvider>
);

export default Index;
