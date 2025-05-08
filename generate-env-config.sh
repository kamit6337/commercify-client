#!/bin/sh

# Generate env-config.js from environment variables
echo "window.env = {" > /usr/share/nginx/html/env-config.js

echo "  VITE_APP_SERVER_URL: \"${VITE_APP_SERVER_URL}\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_APP_NODE_ENV: \"${VITE_APP_NODE_ENV}\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_APP_STRIPE_PUBLISHABLE_KEY: \"${VITE_APP_STRIPE_PUBLISHABLE_KEY}\"," >> /usr/share/nginx/html/env-config.js


echo "}" >> /usr/share/nginx/html/env-config.js