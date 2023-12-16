'use client'

import * as React from 'react';

import styles from './page.module.css'
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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

import { SnackbarProvider, enqueueSnackbar } from 'notistack';


function findShortestPath(startID, endID, variant) {
  let neighbors = {};


  console.log(`findShortestPath: ${startID}, ${endID}, ${variant}`)
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


  var queue = new PriorityQueue((a, b) => {
    if (variant === 'shortest') {
      return a.length < b.length
    } else if (variant === 'fastest') {
      return a.time < b.time
    } else if (variant === "least-transfers") {
      return a.transfers < b.transfers
    } else {
      throw "InvalidVariantInput"
    }
  });

  var handleIsShortest = (a, b) => {
    if (variant === 'shortest') {
      return a.length < b.length
    } else if (variant === 'fastest') {
      return a.time < b.time
    } else if (variant === "least-transfers") {
      if((a.transfers == b.transfers)){
        return a.time < b.time
      } else {
        return a.transfers < b.transfers
      }
    } else {
      throw "InvalidVariantInput"
    }
  }

  queue.enqueue({ id: startID, length: 0, path: [startID], time: 0, transfers: -1, frontOnLine: null });

  var visited = {};
  visited[startID] = 1;

  let shortest = {
    path: [],
    length: 1e100,
    transferList: [],
    isValid: false,
    startStationInfo: { name: "", line: "" },
    time: 1e100,
    transfers: 1000
  };

  var queueInstances = 0

  while (!queue.isEmpty()) {
    queueInstances++;
    if (queueInstances > 100000) {
      throw "AlgorithmError!"
    }
    let current = queue.dequeue();

    if (current.id == endID) {
      console.log(current)
      shortest.isValid = true
      let currentTransfers = 0;
      let currentTransferList = []
      let lastOnLine = -1;
      for (let i = 0; i < current.path.length - 1; i++) {
        let fromID = current.path[i];
        let toID = current.path[i + 1];
        let processedId = new Set()
        for (let neighbor of neighbors[fromID]) {
          if (neighbor.id == toID && !processedId.has(toID)) {
            if (lastOnLine == -1) {
              lastOnLine = neighbor.onLine
            } else if (lastOnLine != neighbor.onLine) {
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
      console.log(current, shortest)
      if (handleIsShortest(current, shortest)) {

        shortest.path = current.path;
        shortest.length = current.length;
        shortest.transfers = currentTransfers;
        shortest.time = current.time;
        shortest.transferList = currentTransferList
        shortest.startStationInfo = {
          name: startID, line: neighbors[startID].find((item, index) => {
            return item.id == current.path[1]
          }).onLine
        }
      }
      continue;
    }

    for (let neighbor of neighbors[current.id]) {
      let nextID = neighbor.id;
      let nextLength = current.length + parseInt(neighbor.length);
      let nextTime = current.time + parseInt(neighbor.length) / (16.67 * 50) + 1 + ((neighbor.onLine === current.frontOnLine) ? 0 : 4)
      let nextPath = [...current.path, parseInt(nextID)];
      let nextTransfer = current.transfers + ((neighbor.onLine === current.frontOnLine) ? 0 : 1);

      if (current.path.includes(parseInt(nextID))) {
        continue
      }

      if (variant == 'shortest' && visited[nextID] && visited[nextID] < nextLength) {
        continue;
      } else if (variant == 'fastest' && visited[nextID] && visited[nextID] < nextTime) {
        continue;
      } else if (variant == 'least-transfers' && visited[nextID] && visited[nextID] - 1 < nextTransfer) {
        continue;
      }

      if (nextLength > 200000) {
        break
      }

      if (variant == 'shortest') {
        visited[nextID] = nextLength;
      } else if (variant == 'fastest') {
        visited[nextID] = nextTime;
      } else {
        visited[nextID] = nextTransfer + 1;
      }

      queue.enqueue({ id: nextID, length: nextLength, path: nextPath, time: nextTime, transfers: nextTransfer, frontOnLine: neighbor.onLine });


    }
  }

  // shortest.length = shortest.length - shortest.transfers * shortest.setPenalties
  // shortest.time = (shortest.length / (16.67 * 60)) + shortest.transfers * 4.0

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

function handleModuleSize() {
  if (window.innerWidth > 600) {
    return "medium"
  } else {
    return "small"
  }
}


export default function Home() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [penalty, setPenalty] = React.useState('shortest')
  const [pathResult, setPathResult] = React.useState({ isValid: false, path: [], length: Infinity, setPenalties: 0, transferList: [], startStationInfo: { name: "", line: "" } })

  const [beginName, setBeginName] = React.useState('')
  const [endName, setEndName] = React.useState('')

  const [maskStatus, setMaskStatus] = React.useState(true)

  const [isTravelTicket, setIfTravelTicket] = React.useState('none')

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
    setPathResult(findShortestPath(foundBeginId, foundEndId, penalty))

    enqueueSnackbar("操作成功！", { variant: "success" })

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
      <SnackbarProvider autoHideDuration={2000}>
        <Head>
          <title>地铁导航系统</title>
          <meta name='description' content='用 React 写的地铁导航系统' />
          <link rel="manifest" href="/manifest.json" />
          <SpeedInsights />
        </Head>
        <CssBaseline />
        <main className={styles.main}>
          <Grid container direction={{ xs: 'column-reverse', sm: 'row' }}>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <Paper className={styles.toplevel} >
                <div className={styles.header}>
                  <div className={styles.logo} style={{ backgroundColor: 'background.paper' }}>
                    <DirectionsSubwayIcon fontSize="large" color='primary' />
                  </div>
                  <AboutModal />
                </div>
                <FormControl fullWidth className={styles.formControl}>
                  <FormLabel id="places-label">起终点</FormLabel>
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
                  <FormLabel id="algorithm-label">策略</FormLabel>
                  <ToggleButtonGroup
                    labelId="algorithm-label"
                    id="algorithm-select"
                    value={penalty}
                    exclusive
                    sx={{ width: "100%" }}
                    color='primary'
                    onChange={(event, newAlignment) => { if (newAlignment !== null) setPenalty(newAlignment) }}
                  >
                    <ToggleButton value='shortest' style={{ flexGrow: 2 }}>距离最短</ToggleButton>
                    <ToggleButton value='fastest' style={{ flexGrow: 2 }}>时间最短</ToggleButton>
                    <ToggleButton value='least-transfers' style={{ flexGrow: 2 }}>最少换乘</ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
                <FormControl fullWidth className={styles.formControl}>
                  <FormLabel id="travel-label">车票种类</FormLabel>
                  <ToggleButtonGroup
                    labelId="travel-label"
                    id="travel-select"
                    value={isTravelTicket}
                    exclusive
                    sx={{ width: "100%" }}
                    color='primary'
                    onChange={(event, newAlignment) => { if (newAlignment !== null) setIfTravelTicket(newAlignment) }}
                  >
                    <ToggleButton value='none' style={{ flexGrow: 2 }}>一卡通、单程票</ToggleButton>
                    <ToggleButton value='timed' style={{ flexGrow: 2 }}>定期票</ToggleButton>
                    <ToggleButton value='special' style={{ flexGrow: 2 }}>旅游票</ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
                <Button variant="contained" size='large' className={styles.goButton} endIcon={<SendIcon />} onClick={handleRouteClick} disabled={beginName == '' || endName == '' || beginName == endName}>开始寻路！</Button>
                <PathSolve
                  pathData={pathResult}
                  startInput={beginName}
                  endInput={endName}
                  isTravelTicket={isTravelTicket}>
                </PathSolve>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} md={8} lg={9} className={styles.rightPanel}>
              <Canvas metadata={pathResult} callMaskToDisappear={() => {
                setTimeout(() => {
                  setMaskStatus(false)
                }, 1);
              }}></Canvas>
            </Grid>
          </Grid>
          <div className={styles.mask} style={{ display: (maskStatus ? 'flex' : 'none') }}>
            <CircularProgress disableShrink />
          </div>
        </main>
        <Analytics />
      </SnackbarProvider>
    </ThemeProvider>
  )
}
