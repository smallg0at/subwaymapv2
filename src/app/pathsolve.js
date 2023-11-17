import * as React from 'react';

import { Card, Grid, Typography, CardContent, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { parse } from "csv-parse";

import stationIdList from './data/stationIdList.json'

import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoopIcon from '@mui/icons-material/Loop';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

var keyIter = 0;



export default function PathSolve(props) {

  function handleTransferText(item) {
    let isTransferStation = props.metadata.transferList.findIndex((item1) => {
      return item1.id == parseInt(item)
      console.log(`${item1.id}, ${parseInt(item)}, ${item1.id == parseInt(item)}`)
    })
    if (isTransferStation != -1) {
      let dt = props.metadata.transferList[isTransferStation]
      return `在此换乘：${dt.prev}${dt.prev.includes('线')?'':' 号线'} ➡ ${dt.to}${dt.to.includes('线')?'':' 号线'}`;
    }
  }

  function handleIfIsTranfer(item, index) {
    let isTransferStation = props.metadata.transferList.findIndex((item1) => {
      return item1.id == parseInt(item)
    })
    if (isTransferStation != -1) return (<ChangeCircleIcon />)
    else if(props.metadata.path.length == index + 1 ) return (<LocationOnIcon />)
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
      <Card variant='outlined'>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            票价￥{handleTicketPrice(props.metadata.length / 1000)} · 总距离 {props.metadata.length / 1000}km <br />
            换乘 {props.metadata.transfers} 次
          </Typography>
          <Divider>路线信息</Divider>
          <List dense>
            <ListItem disableGutters>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary={stationIdList[props.metadata.startStationInfo.name]} secondary={`乘坐 ${props.metadata.startStationInfo.line}${props.metadata.startStationInfo.line.includes('线')?'':' 号线'}`}></ListItemText>
            </ListItem>
            {props.metadata.path.map((item, index) => {
              return (
                <React.Fragment key={keyIter++}>
                  <ListItem disableGutters>
                    <ListItemIcon>
                      {handleIfIsTranfer(item, index)}
                    </ListItemIcon>
                    <ListItemText primary={stationIdList[parseInt(item)]} secondary={handleTransferText(item)}></ListItemText>
                  </ListItem>

                  {/* <Divider light /> */}
                </React.Fragment>
              )
            })}
          </List>
        </CardContent>
      </Card>
    </Grid >
  )
}