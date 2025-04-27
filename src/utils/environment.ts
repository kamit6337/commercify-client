const environment = {
  SERVER_URL:
    window?.env?.VITE_APP_SERVER_URL || import.meta.env.VITE_APP_SERVER_URL,
  NODE_ENV: window?.env?.VITE_APP_NODE_ENV || import.meta.env.VITE_APP_NODE_ENV,
  STRIPE_PUBLISHABLE_KEY:
    window?.env?.VITE_APP_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
};

export default environment;
