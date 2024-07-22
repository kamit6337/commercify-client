import { useLocation } from "react-router-dom";
import "./App.css";
import Router from "./routes/Router";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://e41ccd741ee5cce9c89505daa6c14e27@o4507611013840896.ingest.us.sentry.io/4507611017379840",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function App() {
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;

    if (currentUrl.includes("localhost") || currentUrl.includes("vercel")) {
      setRedirect(false);
    } else {
      setRedirect(true);
      window.location.href = "https://commercify-client.vercel.app";
    }
  }, []);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  if (redirect) {
    return null;
  }

  return (
    <>
      <Router />
    </>
  );
}

export default App;
