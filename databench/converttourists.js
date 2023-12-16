import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync } from "fs";

// 到景点总表的 CSV
const distanceDataText = readFileSync('./TouristAttraction.csv', { encoding: "utf-8" })
// 到 ID => 站名 列表的 JSON
const stationIdList = JSON.parse(readFileSync('../src/app/data/stationIdList.json', { encoding: "utf-8" }))
// 到 所有可能输入（仅包含车站） 的 JSON
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


// 景点 => 站 ID
writeFileSync('../src/app/data/attractionData.json', JSON.stringify(dataNew), { encoding: 'utf-8' })

// 新的所有可输入内容
writeFileSync('../src/app/data/nameListData.json', JSON.stringify(nameList.sort((a, b) => a.localeCompare(b))), { encoding: 'utf-8' })