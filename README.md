# Commercify

<p>It's a Full Stack e-Commerce Web App build in MERN Stack including Stripe payment integartion</p>

Docker Image : [kamit6337/commercify-client](https://hub.docker.com/repository/docker/kamit6337/commercify-client/general)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech](#tech)
- [Screenshots](#screenshots)
- [Running](#running)

## Description

This is an e-Commerce website like Amazon, Flipkart etc. where you can get various products of different categories.

## Features

- Mobile OTP based login
- search functionality
- sort, filtering functionality
- add products to wishlist to buy later
- integrated Stripe payment system to smooth checkout
- see product price and checkout products in local currency
- cancellation features after order placed
- also return the product after delievered
- rate and reviews the product 
- add Google Analytics to track user movement like page views, checkout button, login button etc.
- also attach Sentry for effective Error management


## Tech
<ul>
<li>React JS</li>
<li>Tailwind CSS - <i>for styling of web pages</i></li>
<li>Redux - <i>for global state management</i></li>
<li>React Hook Form - <i>making form filling and validation easy</i></li>
<li>Stripe - <i>online payment integration where user can pay using card</i></li>
<li>React Toastify - <i>showing better UI notification or errors</i></li>
<li>React Query - <i>efficient data fetching and caching making user experience better</i></li>
<li>Material UI - <i>designing of web page with pre-built component</i></li>
</ul>

## Screenshots

Here are the screenshots of my project:

![product 1](https://commercify-vercel.s3.ap-south-1.amazonaws.com/images/commercify1.png)
![product 2](https://commercify-vercel.s3.ap-south-1.amazonaws.com/images/commercify2.png)


## Running

To run this app locally using Docker Image :

- install Docker Desktop from [Docker website](https://www.docker.com/products/docker-desktop) and start to run in background
- create a folder in desktop, open this folder in VS Code
- create a .env file
- copy .env.example file variables from above and paste in .env file
- start filling all environment variables
- open VS Code terminal

```
docker run --env-file .env -p 5173:80 kamit6337/commercify-client
```

- react-app started on http://localhost:5173

