import React, { Component } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, ButtonGroup } from "@mui/material";

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import styles from './canvas.module.css'

import stationPos from './data/stationPos.json'
import StationNode from './submodule/stationNode.js'

export default function Canvas(props) {
  function handleIfIsTranfer(index) {
    return props.metadata.isTransfer[index] != -1
  }

  return (
    <TransformWrapper
      initialScale={0.1}
      minScale={0.05}
      maxScale={1}
      className={styles.canvasWrapper}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <ButtonGroup className={styles.tools} variant="contained">
            <Button onClick={() => zoomIn()} startIcon={<ZoomInIcon />}>放大</Button>
            <Button onClick={() => zoomOut()} startIcon={<ZoomOutIcon />}>缩小</Button>
            <Button onClick={() => resetTransform()} startIcon={<FullscreenIcon />}>重置</Button>
          </ButtonGroup>
          <TransformComponent wrapperClass={styles.canvasWrapper}>
            <canvas className={styles.thecanvas} width={14173} height={11942} style={{ backgroundImage: 'url(\'lwt-min.jpg\')', imageRendering: 'crisp-edges' }}>
            </canvas>
            {props.metadata.path.map((item, index) => {
              // console.log(`${item} => ${stationPos[item].id}`)
              return (
                <StationNode
                  x={stationPos[item].x}
                  y={stationPos[(item)].y}
                  key={stationPos[item].id}
                  sid={stationPos[item].id}
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