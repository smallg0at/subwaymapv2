'use client'

import * as React from 'react';

import Image from 'next/image'
import styles from './page.module.css'
import styleClasses from './page.customs.css'
import { Paper, Typography, Button, Select, MenuItem, InputLabel, FormControl, ButtonGroup } from '@mui/material'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Unstable_Grid2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Head from 'next/head'
import { Analytics } from '@vercel/analytics/react';

import Canvas from './canvas';
import PathSolve from './pathsolve';

import nameList from './data/nameList.json'
import distanceData from './data/distanceData.json'
import stationIdList from './data/stationIdList.json'

import { PriorityQueue } from 'buckets-js'


function findShortestPath(startID, endID, transferPenalty = 0) {//请将这个计算地铁路径的 JavaScript 函数改造为使用 Dijkstra 算法。不要搜索，直接使用代码块放代码。
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

  queue.enqueue({ id: startID, length: 0, path: [startID]});

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
  shortest.path.forEach((item, index)=>{
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

  function handleRouteClick() {
    let foundBeginId = stationIdList.findIndex((item) => { return item == beginName })
    let foundEndId = stationIdList.findIndex((item) => { return item == endName })
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
        },
      }),
    [prefersDarkMode],
  );


  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title></title>
        <meta name='description' content='用 React 写的地铁导航系统' />
      </Head>
      <CssBaseline />
      <main className={styles.main}>
        <Grid container>
          <Grid xs={3}>
            <Paper className={styles.toplevel}>
              <Typography variant="h4" gutterBottom>地铁线路图</Typography>
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
              </FormControl>
              <Button variant="contained" size='large' className={styles.goButton} endIcon={<SendIcon />} onClick={handleRouteClick} disabled={beginName == '' || endName == '' || beginName == endName}>开始寻路！</Button>
              <PathSolve
                metadata={pathResult}>
              </PathSolve>
            </Paper>
          </Grid>
          <Grid xs={9} className={styles.rightPanel}>
            <Canvas metadata={pathResult} callMaskToDisappear={()=>{setTimeout(() => {
              setMaskStatus(false)
            }, 1000);}}></Canvas>
          </Grid>
        </Grid>
        <div className={styles.mask} style={{display: (maskStatus?'block':'none')}}></div>
      </main>
      <Analytics />
    </ThemeProvider>
  )
}
