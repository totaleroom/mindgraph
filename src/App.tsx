import { useEffect } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { Landing } from "./pages/Landing";
import { Workspace } from "./pages/Workspace";

export default function App() {
  const { route, navigate } = useHashRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (route === "app") {
    return <Workspace onExit={() => navigate("landing")} />;
  }
  return <Landing onLaunch={() => navigate("app")} />;
}
