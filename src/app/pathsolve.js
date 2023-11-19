import * as React from 'react';

import { Card, Typography, CardContent, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

import stationIdList from './data/stationIdList.json'

import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

var keyIter = 0;



export default function PathSolve(props) {

  function handleTransferText(index) {
    if (props.metadata.isTransfer[index] != -1) {
      let dt = props.metadata.transferList[props.metadata.isTransfer[index]]
      console.log(dt)
      return `在此换乘：${dt.prev}${dt.prev.includes('线') ? '' : ' 号线'} ➡ ${dt.to}${dt.to.includes('线') ? '' : ' 号线'}`;
    }
  }

  function handleIfIsTranfer(item, index) {
    if (props.metadata.isTransfer[index] != -1) return (<ChangeCircleIcon />)
    else if (props.metadata.path.length == index + 1) return (<LocationOnIcon />)
    else return (<ArrowDownwardIcon color='text.secondary' style={{ opacity: 0.3 }} />)
  }

  function handleTicketPrice(distance) {
    if (distance < 0 && !isNaN(distance)) {
      return 0
    } else if (distance <= 6) {
      return 3
    } else if (distance <= 12) {
      return 4
    } else if (distance <= 22) {
      return 5
    } else if (distance <= 32) {
      return 6
    } else {
      return 6 + (Math.ceil((distance - 32) / 20))
    }
  }

  return (
    <Grid container direction={'column'} sx={{ display: (props.metadata.isValid) ? 'flex' : 'none' }}>
      <Card variant='outlined' style={{marginBottom: '15px'}}>
        <CardContent style={{paddingBottom: '16px'}}>
        <Grid container>
            <Grid item xs={6}>
            <Typography fontSize={'20px'} gutterBottom>{Math.ceil(props.metadata.time)} 分钟</Typography>
            </Grid>
            <Grid item xs={6}>
            <Typography fontSize={'20px'} gutterBottom>{(props.metadata.length / 1000).toFixed(1)}km</Typography>
            </Grid>
            <Grid item xs={6}>
            <Typography fontSize={'20px'}>换乘 {props.metadata.transfers} 次</Typography>
            </Grid>
            <Grid item xs={6}>
            <Typography fontSize={'20px'}>票价￥{handleTicketPrice(props.metadata.length / 1000)}</Typography>
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
              <ListItemText primary={stationIdList[props.metadata.startStationInfo.name]+`(${props.metadata.startStationInfo.name})`} secondary={`乘坐 ${props.metadata.startStationInfo.line}${props.metadata.startStationInfo.line.includes('线') ? '' : ' 号线'}`}></ListItemText>
            </ListItem>
            {props.metadata.path.map((item, index) => {
              if(index > 0){
              return (
                <React.Fragment key={keyIter++}>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      {handleIfIsTranfer(item, index)}
                    </ListItemIcon>
                    <ListItemText primary={stationIdList[parseInt(item)]+`(${parseInt(item)})`} secondary={handleTransferText(index)}></ListItemText>
                  </ListItem>

                  {/* <Divider light /> */}
                </React.Fragment>
              )}
            })}
          </List>
        </CardContent>
      </Card>
    </Grid >
  )
}