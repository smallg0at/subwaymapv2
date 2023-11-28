# Subway Map

A subway map web utility written with React + Next.js + MUI. Full beijing subway data included. [🔗 Try it now!*](https://beijingsubwaymap.vercel.app/)

\* Visitors from specific regions may experience issue accessing this. 

## Features

- Very friendly UI
- Dark mode
- Three pathfinding options: Shortest, Fastest, Least Transfers

## Init

```bash
npm install
```

## Testing

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building

Make sure the dev server is closed before building.

```bash
npm run build
npm start
```

## Data Structure

All data is stored in `src/app/data`.

- `distanceData.json`: Map edge information, for pathfinding
- `nameList.json`: Possible station name input strings
- `stationIdList.json`: index -> station name list. may contain null values.
- `stationPos.json`: Station position on image, used for drawing.

Note:

- Station numeric ID MUST be unique for each station, but can be non-cumulative.
- Interconnected stations should use the same ID.
- Station name doesn't matter as none of the pathfinding use it, you can tweak it anyway.

## About

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Data was last updated on Nov. 2023.