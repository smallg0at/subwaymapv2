import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from "fs";
// import stationIdList from '../src/app/data/stationIdList.json'

// const distanceDataText = readFileSync('../assets/human_powered_formfilling_v2.csv', { encoding: "utf-8" })

// const distanceData = parse(distanceDataText, {
//   columns: true
// });

// writeFileSync('../assets/pathData.json', JSON.stringify(distanceData), {encoding: 'utf-8'})
const distanceDataText = readFileSync('./TouristAttraction.csv', { encoding: "utf-8" })
const stationIdList = JSON.parse(readFileSync('../src/app/data/stationIdList.json', { encoding: "utf-8" }))
const nameList = JSON.parse(readFileSync('../src/app/nameList.json', { encoding: "utf-8" }))

const dataOld = parse(distanceDataText, {
    columns: true
});

function tryToAppendAttraction(name){
    if(!nameList.includes(name)){
        nameList.push(name)
    }
}

var dataNew = {}

dataOld.forEach((item) => {
    let isThisValid = stationIdList.findIndex((stnname) => {
        return stnname == item.station
    })
    if (isThisValid == -1) {
        let removedZhanStationName = item.station.replace("站", "")
        let appendedZhanStationName = item.station + "站"
        isThisValid = stationIdList.findIndex((stnname) => {
            return stnname == removedZhanStationName || stnname == appendedZhanStationName
        })
        if (isThisValid != -1) {
            dataNew[item.attraction] = isThisValid
            tryToAppendAttraction(item.attraction)
        } else { console.log(`${item.station} / ${removedZhanStationName} / ${appendedZhanStationName} NOT FOUND!`) }
    } else {
        dataNew[item.attraction] = isThisValid
        tryToAppendAttraction(item.attraction)
    }
})



writeFileSync('../src/app/data/attractionData.json', JSON.stringify(dataNew), { encoding: 'utf-8' })
writeFileSync('../src/app/data/nameListData.json', JSON.stringify(nameList.sort((a, b) => a.localeCompare(b))), { encoding: 'utf-8' })