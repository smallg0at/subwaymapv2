# Beijing Subway Map

A subway map web utility written with React + Next.js + MUI. Full beijing subway data included. 

Also supports Android / Electron platforms.

[🔗 Try it now!*](https://beijingsubwaymap.vercel.app/)

\* Visitors from specific regions may experience issue accessing this. If you have trouble, use this link:

[🔗 Try it now!*](https://smallg0at.github.io/subwaymapv2/)



## Features

- Very friendly UI
- Dark mode
- Three pathfinding options: Shortest, Fastest, Least Transfers
- Travel Ticket option
- Mobile-friendly

## Init

```bash
npm i
```

## Testing

Run the development server:

```bash
npm run dev
```

Open [http://localhost:35168](http://localhost:35168) with your browser to see the result.

## Building (Web)

⚠ Make sure the dev server is closed before building.

```bash
npm run build
npm start
```

## Building (Android)

### Requirements

Android Studio + Android SDK 33

### Usage

```bash
npm run build
npx cap sync
```

Then launch Android Studio with:

```
npx cap open android
```

## Building (Electron)

### Setup

This will take a while

```
cd ./electron/
npm i
```

### Building

```
cd ./electron/
npm run electron:make
```

## Data Structure

All data is stored in `src/app/data`.

- `distanceData.json`: Map edge information, for pathfinding
- `nameList.json`: Possible station name + attraction sites input strings
- `stationIdList.json`: index -> station name list. may contain null values.
- `stationPos.json`: Station position on image, used for drawing.
- `attractionData.json`: attraction name -> station id list

Note:

- Station numeric ID MUST be unique for each station, but can be non-cumulative.
- Interconnected stations should use the same ID.
- Station name doesn't matter as none of the pathfinding use it, you can tweak it anyway
- files in `./databench` is for data pre-processing, and is not used by the application.

## Toolkits for conversion

Scattered in `databench/`. Read `databench/conversion.cjs` for more details.

## License

This project uses a modified MIT License with the following limitation:

- The author name above must be credited in the report when a modified version of this software is used to compose one.

## Telemetry

For performance analytics reasons, this app will send anonymous data to vercel's server to help the author to do some optimization. You can turn it off by removing the module from source code.

## About

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Data was last updated on Nov. 2023.