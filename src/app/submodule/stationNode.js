import * as React from 'react'
import styles from './stationNode.module.css';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import Paper from '@mui/material/Paper';

export default function StationNode(props) {
    function handleIfIsTranfer() {
        if (props.isTransfer) return (<ChangeCircleOutlinedIcon style={{ width: '170px', height: '170px' }} />)
        // else return <LocationOnIcon style={{ width: '150px', height: '150px' }} />
    }

    return (
        <Paper className={styles.stationNode}
            style={{ left: `${props.x}px`, top: `${props.y}px` }}
            id={`stn-${props.sid}`}
            data-isTransfer={props.isTransfer}
            elevation={24}
            data-sindex={props.sindex}
        >
            {handleIfIsTranfer()}
        </Paper>
    )
}