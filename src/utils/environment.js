const environment = {
  SERVER_URL: import.meta.env.VITE_APP_SERVER_URL,
  CLIENT_URL: import.meta.env.VITE_APP_CLIENT_URL,
  NODE_ENV: import.meta.env.VITE_APP_NODE_ENV,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
};

export default environment;
