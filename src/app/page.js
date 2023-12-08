'use client'

import * as React from 'react';

import styles from './page.module.css'
import { Paper, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress, FormControlLabel, Switch } from '@mui/material'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Unstable_Grid2';
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react';

import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';

import Canvas from './canvas';
import PathSolve from './pathsolve';
import AboutModal from './submodule/aboutModal.js'

import distanceData from './data/distanceData.json'
import stationIdList from './data/stationIdList.json'
import nameList from './data/nameListData.json'
import attractionData from "./data/attractionData.json";

import { PriorityQueue } from 'buckets-js'

import { green, amber } from '@mui/material/colors';

import { SpeedInsights } from "@vercel/speed-insights/next"


function findShortestPath(startID, endID, transferPenalty = 0) {
  let neighbors = {};
  console.log(`findShortestPath: ${startID}, ${endID}, ${transferPenalty}`)
  // Setup graph
  for (let record of distanceData) {
    let id1 = record.id1; //站ID1
    let id2 = record.id2; //站ID2
    let onLine = record.onLine; //一条边所在的线路
    let length = parseInt(record.length);
    if (!neighbors[id1]) {
      neighbors[id1] = [];
    }
    if (!neighbors[id2]) {
      neighbors[id2] = [];
    }
    neighbors[id1].push({ id: id2, length: length, onLine: onLine }); // 数据为无向边
    neighbors[id2].push({ id: id1, length: length, onLine: onLine });
  }


  let queue = new PriorityQueue((a, b) => a.length < b.length);

  queue.enqueue({ id: startID, length: 0, path: [startID] });

  let visited = {};
  visited[startID] = 0;

  let shortest = { path: [], length: 1e100, setPenalties: transferPenalty, transferList: [], isValid: false, startStationInfo: { name: "", line: "" }, time: 0.0 };
  console.log(neighbors[startID])

  while (!queue.isEmpty()) {

    let current = queue.dequeue();
    let currentID = current.id;
    let currentLength = current.length;
    let currentPath = current.path;


    if (currentID == endID) {
      shortest.isValid = true
      let currentTransfers = 0;
      let currentTransferList = []
      let lastOnLine = -1;
      for (let i = 0; i < currentPath.length - 1; i++) {
        let fromID = currentPath[i];
        let toID = currentPath[i + 1];
        let processedId = new Set()
        for (let neighbor of neighbors[fromID]) {
          if (neighbor.id == toID && !processedId.has(toID)) {
            if (lastOnLine == -1) {
              lastOnLine = neighbor.onLine
            } else if (lastOnLine != neighbor.onLine) {
              currentLength += transferPenalty;
              currentTransfers = currentTransfers + 1;
              currentTransferList.push({
                id: fromID,
                prev: lastOnLine,
                to: neighbor.onLine
              })
              lastOnLine = neighbor.onLine
            }
            processedId.add(toID)
          }
        }
      }
      console.log(current, currentTransfers)
      if (currentLength < shortest.length) {
        shortest.path = currentPath;
        shortest.length = currentLength;
        shortest.transfers = currentTransfers;
        shortest.transferList = currentTransferList
        shortest.startStationInfo = {
          name: startID, line: neighbors[startID].find((item, index) => {
            return item.id == currentPath[1]
          }).onLine
        }
      }
      // break;
    }

    for (let neighbor of neighbors[currentID]) {
      let nextID = neighbor.id;
      let nextLength = currentLength + parseInt(neighbor.length);

      if (visited[nextID] && visited[nextID] <= nextLength) {
        continue;
      }

      let nextPath = [...currentPath, nextID];
      queue.enqueue({ id: nextID, length: nextLength, path: nextPath });

      visited[nextID] = nextLength;
    }
  }

  shortest.length = shortest.length - shortest.transfers * shortest.setPenalties
  shortest.time = (shortest.length / (16.67 * 60)) + shortest.transfers * 4.0

  shortest.isTransfer = []
  shortest.path.forEach((item, index) => {
    let isTransferStation = shortest.transferList.findIndex((item1) => {
      return item1.id == parseInt(item)
    })
    shortest.isTransfer.push(isTransferStation)
  })
  console.log(shortest)
  return shortest;
}



export default function Home() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [penalty, setPenalty] = React.useState(0)
  const [pathResult, setPathResult] = React.useState({ isValid: false, path: [], length: Infinity, setPenalties: 0, transferList: [], startStationInfo: { name: "", line: "" } })

  const [beginName, setBeginName] = React.useState('')
  const [endName, setEndName] = React.useState('')

  const [maskStatus, setMaskStatus] = React.useState(true)

  const [isTravelTicket, setIfTravelTicket] = React.useState(false)

  function handleRouteClick() {
    let foundBeginId = stationIdList.findIndex((item) => { return item == beginName })
    let foundEndId = stationIdList.findIndex((item) => { return item == endName })
    if (foundBeginId == -1) {
      if (Object.hasOwn(attractionData, beginName)) {
        foundBeginId = attractionData[beginName]
      }
    }
    if (foundEndId == -1) {
      if (Object.hasOwn(attractionData, endName)) {
        foundEndId = attractionData[endName]
      }
    }
    if (foundBeginId == -1 || foundEndId == -1) {
      alert("没有找到对应的站点信息")
      throw "BeginOrEndIdNotFound"
    }
    setPathResult(findShortestPath(foundBeginId, foundEndId, parseInt(penalty)))
  }
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: green,
          secondary: amber,
        },
      }),
    [prefersDarkMode],
  );


  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title></title>
        <meta name='description' content='用 React 写的地铁导航系统' />
        <SpeedInsights/>
      </Head>
      <CssBaseline />
      <main className={styles.main}>
        <Grid container>
          <Grid xs={3}>
            <Paper className={styles.toplevel} >
              <div className={styles.header}>
                <div className={styles.logo}>
                  <DirectionsSubwayIcon fontSize="large" color='primary' />
                </div>
                <AboutModal />
              </div>
              <FormControl fullWidth className={styles.formControl}>
                <Autocomplete
                  disablePortal
                  id="combo-box-begin"
                  options={nameList}
                  renderInput={(params) => <TextField {...params} label="起点" />}
                  value={beginName}
                  onChange={(event, value) => { setBeginName(value) }}
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-end"
                  options={nameList}
                  renderInput={(params) => <TextField {...params} label="终点" />}
                  value={endName}
                  onChange={(event, value) => { setEndName(value) }}
                />
              </FormControl>
              <FormControl fullWidth className={styles.formControl}>
                <InputLabel id="algorithm-label">策略</InputLabel>
                <Select
                  labelId="algorithm-label"
                  id="algorithm-select"
                  value={penalty}
                  label="策略"
                  onChange={(event => { setPenalty(event.target.value) })}
                >
                  <MenuItem value={0}>距离最短</MenuItem>
                  <MenuItem value={2000}>时间最短</MenuItem>
                  <MenuItem value={9999999}>最少换乘</MenuItem>
                </Select>
                <FormControlLabel control={<Switch value={isTravelTicket} onChange={(event=>{setIfTravelTicket(event.target.checked)})} />} label="使用旅游票" />
              </FormControl>
              <Button variant="contained" size='large' className={styles.goButton} endIcon={<SendIcon />} onClick={handleRouteClick} disabled={beginName == '' || endName == '' || beginName == endName}>开始寻路！</Button>
              <PathSolve
                metadata={pathResult}
                startInput={beginName}
                endInput={endName}
                isTravelTicket={isTravelTicket}>
              </PathSolve>
            </Paper>
          </Grid>
          <Grid xs={9} className={styles.rightPanel}>
            <Canvas metadata={pathResult} callMaskToDisappear={() => {
              setTimeout(() => {
                setMaskStatus(false)
              }, 1000);
            }}></Canvas>
          </Grid>
        </Grid>
        <div className={styles.mask} style={{ display: (maskStatus ? 'flex' : 'none') }}>
          <CircularProgress disableShrink />
        </div>
      </main>
      <Analytics />
    </ThemeProvider>
  )
}
