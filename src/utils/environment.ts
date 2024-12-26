const environment = {
  SERVER_URL:
    window?.env?.VITE_APP_SERVER_URL || import.meta.env.VITE_APP_SERVER_URL,
  NODE_ENV: window?.env?.VITE_APP_NODE_ENV || import.meta.env.VITE_APP_NODE_ENV,
  COUNTRY_KEY_EMAIL:
    window?.env?.VITE_APP_COUNTRY_KEY_EMAIL ||
    import.meta.env.VITE_APP_COUNTRY_KEY_EMAIL,
  COUNTRY_KEY:
    window?.env?.VITE_APP_COUNTRY_KEY || import.meta.env.VITE_APP_COUNTRY_KEY,
  CURRENCY_EXCHANGE_KEY:
    window?.env?.VITE_APP_CURRENCY_EXCHANGE_KEY ||
    import.meta.env.VITE_APP_CURRENCY_EXCHANGE_KEY,
  STRIPE_PUBLISHABLE_KEY:
    window?.env?.VITE_APP_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
};

export default environment;
