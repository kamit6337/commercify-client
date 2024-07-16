import { useLocation } from "react-router-dom";
import "./App.css";
import Router from "./routes/Router";
import { useEffect } from "react";
import ReactGA from "react-ga4";

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
