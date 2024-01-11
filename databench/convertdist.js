// Converts manually-input 

import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from "fs";

// const distanceDataText = readFileSync('../assets/human_powered_formfilling_v2.csv', { encoding: "utf-8" })

// const distanceData = parse(distanceDataText, {
//   columns: true
// });

// writeFileSync('../assets/pathData.json', JSON.stringify(distanceData), {encoding: 'utf-8'})
const distanceDataText = readFileSync('../assets/stationPos.csv', { encoding: "utf-8" })

const dataOld = parse(distanceDataText, {
  columns: true
});

var dataNew = {}

dataOld.forEach((item)=>{
  dataNew[item.id] = ({
    id: item.id,
    name: item.name,
    x: item.pos.split(',')[0],
    y: item.pos.split(',')[1]
  })
})

writeFileSync('../assets/stationPos.json', JSON.stringify(dataNew), {encoding: 'utf-8'})