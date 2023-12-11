import React, { useEffect } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";


import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import styles from './canvas.module.css'

import stationPos from './data/stationPos.json'
import StationNode from './submodule/stationNode.js'
import CanvasImage from './submodule/canvasImage.js'

import Image from 'next/image'

export default function Canvas({metadata, callMaskToDisappear}) {

  const memorizedMetadata = React.useMemo(()=>{
    return metadata
  }, [metadata])

  function handleIfIsTranfer(index) {
    return metadata.isTransfer[index] != -1
  }

  // updateLines()
  useEffect(()=>{
    var ctx = document.querySelector('#the-canvas').getContext('2d')
    ctx.reset()
    ctx.strokeStyle = '#263238'
    ctx.lineWidth = 100
    if(metadata.path.length == 0) return;
    for(let i=1; i<metadata.path.length; i++){
      ctx.moveTo(stationPos[metadata.path[i]].x, stationPos[metadata.path[i]].y)
      ctx.lineTo(stationPos[metadata.path[i-1]].x, stationPos[metadata.path[i-1]].y)
      ctx.stroke()
    }
  }, [metadata])

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
            <Fab onClick={() => zoomIn()} size="small" color="primary"><ZoomInIcon /></Fab>
            {/* <Fab onClick={() => resetTransform()} color="primary" size="small"><FullscreenIcon /></Fab> */}
            <Fab onClick={() => zoomOut()} size="small" color="primary"><ZoomOutIcon /></Fab>
          </Box>
          <TransformComponent wrapperClass={styles.canvasWrapper}>
            <CanvasImage callMaskToDisappear={()=>callMaskToDisappear()}/>
            <canvas className={styles.thecanvas} id="the-canvas" width={14173} height={11942}></canvas>
            {memorizedMetadata.path.map((item, index) => {
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