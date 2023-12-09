import * as React from 'react';

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Grid from '@mui/material/Unstable_Grid2';

import stationIdList from './data/stationIdList.json'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

var keyIter = 0;



export default function PathSolve({ pathData, startInput, endInput, isTravelTicket }) {

  const metadata = React.useMemo(() => {
    return pathData
  }, [pathData])

  function handleTransferText(index) {
    if (metadata.isTransfer[index] != -1) {
      let dt = metadata.transferList[metadata.isTransfer[index]]
      // console.log(dt)
      return `在此换乘：${dt.prev}${dt.prev.includes('线') ? '' : ' 号线'} ➡ ${dt.to}${dt.to.includes('线') ? '' : ' 号线'}`;
    }
  }

  function handleIfIsTranfer(item, index) {
    if (metadata.isTransfer[index] != -1) return (<ChangeCircleIcon />)
    else if (metadata.path.length == index + 1) return (<LocationOnIcon />)
    else return (<ArrowDownwardIcon color='text.secondary' style={{ opacity: 0.3 }} />)
  }



  function handleStartDiffText() {
    if (startInput != stationIdList[metadata.path[0]]) {
      return <Typography variant="body2" style={{ marginTop: '5px' }}>{startInput} 在 {stationIdList[metadata.path[0]]} 站附近</Typography>
    } else {
      return <React.Fragment />
    }
  }

  function handleEndDiffText() {
    if (endInput != stationIdList[metadata.path[metadata.path.length - 1]]) {
      return <Typography variant="body2" style={{ marginTop: '5px' }}>{endInput} 在 {stationIdList[metadata.path[metadata.path.length - 1]]} 站附近</Typography>
    } else {
      return <React.Fragment />
    }
  }

  const handleTravelText = React.useMemo(() => {
    var price = 0;
    var distance = metadata.length / 1000.0
    var triggeredPriceReduction = false
    if(isTravelTicket == 'special' && distance > 13.139){
      distance = 13.139
      triggeredPriceReduction = true
    }
    if (distance < 0 && !isNaN(distance)) {
      price = 0
    } else if (distance <= 6) {
      price = 3
    } else if (distance <= 12) {
      price = 4
    } else if (distance <= 22) {
      price = 5
    } else if (distance <= 32) {
      price = 6
    } else {
      price = 6 + (Math.ceil((distance - 32) / 20))
    }
    if (isTravelTicket == 'timed') {
      return (
        <span style={{ fontSize: '12px' }}>已包含在定期票</span>
      );
    }
    else if(isTravelTicket == 'special'){
      return (
        <>
        <span>{"￥" + String(price)}&nbsp;</span>
        <span style={{ fontSize: '12px' }}>旅游票折扣</span>
        </>
      );
    } else {
      console.log(price, distance, metadata)
      return "￥" + String(price)
    }
  }, [isTravelTicket, metadata])


  return (
    <Grid container direction={'column'} sx={{ display: (metadata.isValid) ? 'flex' : 'none' }}>
      <Card variant='outlined' style={{ marginBottom: '15px' }}>
        <CardContent style={{ paddingBottom: '16px' }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography fontSize={'20px'} gutterBottom>{Math.ceil(metadata.time)} 分钟</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontSize={'20px'} gutterBottom>{(metadata.length / 1000).toFixed(1)}km</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontSize={'20px'}>换乘 {metadata.transfers} 次</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontSize={'20px'}>票价 {handleTravelText}</Typography>
            </Grid>
          </Grid>

        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardContent>
          <Typography variant='h5'>路线信息</Typography>
          <List dense>
            <ListItem disableGutters>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary={stationIdList[metadata.startStationInfo.name]} secondary={`乘坐 ${metadata.startStationInfo.line}${metadata.startStationInfo.line.includes('线') ? '' : ' 号线'}`}></ListItemText>
            </ListItem>
            {metadata.path.map((item, index) => {
              if (index > 0) {
                return (
                  <React.Fragment key={keyIter++}>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        {handleIfIsTranfer(item, index)}
                      </ListItemIcon>
                      <ListItemText primary={stationIdList[parseInt(item)]} secondary={handleTransferText(index)}></ListItemText>
                    </ListItem>

                    {/* <Divider light /> */}
                  </React.Fragment>
                )
              }
            })}
          </List>
        </CardContent>
      </Card>
    </Grid >
  )
}