import React, { useEffect } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, ButtonGroup, Fab, Box } from "@mui/material";

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import styles from './canvas.module.css'

import stationPos from './data/stationPos.json'
import StationNode from './submodule/stationNode.js'
import CanvasImage from './submodule/canvasImage.js'

import Image from 'next/image'

export default function Canvas(props) {
  function handleIfIsTranfer(index) {
    return props.metadata.isTransfer[index] != -1
  }

  function updateLines(){
    var ctx = document.querySelector('#the-canvas').getContext('2d')
    ctx.reset()
    ctx.strokeStyle = '#263238'
    ctx.lineWidth = 100
    if(props.metadata.path.length == 0) return;
    for(let i=1; i<props.metadata.path.length; i++){
      ctx.moveTo(stationPos[props.metadata.path[i]].x, stationPos[props.metadata.path[i]].y)
      ctx.lineTo(stationPos[props.metadata.path[i-1]].x, stationPos[props.metadata.path[i-1]].y)
      ctx.stroke()
    }
  }
  // updateLines()
  useEffect(()=>{
    updateLines()
  })

  return (
    <TransformWrapper
      initialScale={0.1}
      minScale={0.05}
      maxScale={1}
      className={styles.canvasWrapper}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <Box className={styles.tools} variant="contained">
            <Fab onClick={() => zoomIn()} color="primary"><ZoomInIcon /></Fab>
            {/* <Fab onClick={() => resetTransform()} color="primary" size="small"><FullscreenIcon /></Fab> */}
            <Fab onClick={() => zoomOut()} color="primary"><ZoomOutIcon /></Fab>
          </Box>
          <TransformComponent wrapperClass={styles.canvasWrapper}>
            <CanvasImage callMaskToDisappear={()=>props.callMaskToDisappear()}/>
            <canvas className={styles.thecanvas} id="the-canvas" width={14173} height={11942}></canvas>
            {props.metadata.path.map((item, index) => {
              // console.log(`${item} => ${stationPos[item].id}`)
              return (
                <StationNode
                  x={stationPos[item].x}
                  y={stationPos[(item)].y}
                  key={stationPos[item].id}
                  sid={stationPos[item].id}
                  sindex={index}
                  isTransfer={handleIfIsTranfer(index)}
                ></StationNode>
              )
            })}
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>

  )
}