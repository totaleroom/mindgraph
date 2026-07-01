import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHashRoute } from "./hooks/useHashRoute";
import { Landing } from "./pages/Landing";
import { Workspace } from "./pages/Workspace";

export default function App() {
  const { route, navigate } = useHashRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {route === "app" ? (
          <Workspace onExit={() => navigate("landing")} />
        ) : (
          <Landing onLaunch={() => navigate("app")} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
