import { useCallback, useEffect, useState } from "react";

export type Route = "landing" | "app";

function parse(): Route {
  return window.location.hash.replace(/^#\/?/, "") === "app" ? "app" : "landing";
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = next === "app" ? "/app" : "/";
  }, []);

  return { route, navigate };
}
