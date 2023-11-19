import * as React from 'react'
import styles from './stationNode.module.css';

export default function StationNode(props){
    return (
        <div className={styles.stationNode} style={{left: `${props.x}px`, top: `${props.y}px`}} id={`stn-${props.sid}`}></div>
    )
}