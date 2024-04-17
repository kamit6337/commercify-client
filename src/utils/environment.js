const environment = {
  SERVER_URL: import.meta.env.VITE_APP_SERVER_URL,
  CLIENT_URL: import.meta.env.VITE_APP_CLIENT_URL,
  NODE_ENV: import.meta.env.VITE_APP_NODE_ENV,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
  GEO_API_KEY: import.meta.env.VITE_APP_GEO_API_KEY,
  CURRENCY_EXCHANGE_KEY: import.meta.env.VITE_APP_CURRENCY_EXCHANGE_KEY,
};

export default environment;
