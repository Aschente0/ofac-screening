This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## The "Front end"
The front end application is comprised of a single form that takes as inputs:
  - full name,
  - birth year, and
  - country
Using these inputs, the application fetches from an API endpoint that queries against OFAC sanction lists to check for matches for the individual.

## The "Back end"
The back end portion is implemented via a serverless function. The serverless function makes use of [OFAC-api.com](https://docs.ofac-api.com/) to query for matches; more specifically, it leverages the screening api.
The API token uses the free tier and is limited to 100 requests per month.

## Deployed application
The application is accessible via [this deployed url](https://ofac-screening.vercel.app/)

## To run locally...
Create a `.env` file with your own OFAC api token
```bash
OFAC_API_KEY={your key}
```
Install the npm dependencies 
```bash
npm install
```
Then spin up the local instance
```bash
npm run dev
```
Access at http://localhost:3000

## Improvements & Optimizations
This is just a simple webapp for demo purposes. Some rough edges to clean up would be better error handling in terms of UI/UX, logging, and monitoring.
With a real, paid-tier OFAC token, some work should also probably be done to limit unauthenticated (from the perspective of this application) API usage.
A deeper dive of the OFAC api is also something to do, as there are many tweaks that can be done (e.g. `minScore` param, parsing aliases, etc); a deeper dive could allow us to better leverage the API and possibly infer more data from information such as aliases.
