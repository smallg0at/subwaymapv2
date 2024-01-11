
// Reference see https://github.com/majesty17/cs_bjsubway
// This Script Parses XML Metrodata from baidu and automatically number them. 
// Results are consistent, and this script is safe to reuse.

const fs = require('fs');
var parser = require('xml2json');

fileIn = fs.readFileSync( '../assets/baidu_metrodata.xml');

var oldJsonObject = JSON.parse(parser.toJson(fileIn.toString()))

const keepKeys = ['sw', 'l', 'p', 'cid', 'c', 'version', 'lid', 'uid', 'lb', 'loop', 'lbx', 'lby', 'lc', 'sid', 'x', 'y', 'rx', 'ry', 'ex', 'ln']

var iterations = 0

var StationIdArr = new Array()

var StationIdCur = 0

var stationMarkMetadata = "id1,id2,stnName1,stnName2,length\n"

var stationPositionMetadata = '"id","name","pos"\n'

var lastStationIndex = 0;

var stationLineArr = [];

function filterKeys(obj, keysToKeep, parentInfo='top', level=0) {
    iterations++
    if (Array.isArray(obj)) {
        // console.log(`Level ${level} ARRAY: ${parentInfo}, length = ${obj.length}`)
        return obj.map((item, index) => filterKeys(item, keysToKeep, `${parentInfo}[${index}]`, level+1));
    } else if (typeof obj === 'object') {
        // console.log(`Level ${level} OBJECT: ${parentInfo}`)
        let newObj = {};
        if(Object.hasOwn(obj, 'sid') && Object.hasOwn(obj, 'ln')){
            if(obj.sid == ""){
                return obj;
            }
            let foundStationIndex = StationIdArr.findIndex((value)=>{return(value == obj.sid)})
            if(foundStationIndex == -1){
                obj.uid = StationIdCur;
                StationIdArr[StationIdCur] = obj.sid
                // console.log(`Assigned id ${obj.uid} to ${obj.sid}`)
                if(StationIdCur >= 1) stationMarkMetadata += `${lastStationIndex},${obj.uid},${StationIdArr[lastStationIndex]},${obj.sid},\n`
                stationPositionMetadata += `"${obj.uid}","${obj.sid}",""\n`
                stationLineArr.push(obj.ln.split(","))
                lastStationIndex = StationIdCur
                StationIdCur++;
            } else {
                obj.uid = foundStationIndex;
                console.log(`Station name ${obj.sid} already exist at ${foundStationIndex}`)
                stationMarkMetadata += `${lastStationIndex},${foundStationIndex},${StationIdArr[lastStationIndex]},${obj.sid},\n`
                lastStationIndex = foundStationIndex;
                StationIdCur++
            }
        }
        for (let key in obj) {
            if (keysToKeep.includes(key)) {
                newObj[key] = filterKeys(obj[key], keysToKeep, parentInfo + '/' + key, level+1);
            }
        }
        return newObj;
    } else {
        // console.log(`Level ${level} DATA: ${parentInfo}`)
        if(typeof obj === 'string'){
            if(obj.includes("北京市|")){
                return obj.replace('北京市|', '北京市|')
            } else {
                return obj
            }
        } else {
            return obj;
        }
    }
}

var newObject = filterKeys(oldJsonObject, keepKeys)

// Uncomment lines below to write to those files.

// Just the original file converted to json.
// fileOut = fs.writeFileSync('../assets/baidu_metrodata.json', JSON.stringify(newObject)) 

// Trimmed file, somewhat unused
// fileOut2 = fs.writeFileSync('../assets/baidu_metrodata_unfiltered.json', JSON.stringify(oldJsonObject))

// For station distances table template - please use convertdist.js to parse it to JSON after filling
// fileOut3 = fs.writeFileSync('../assets/human_powered_formfilling_v3.csv', stationMarkMetadata)

// For station x-y position table template - semi-auto marking tool see coordinates.py
fileOut4 = fs.writeFileSync('../assets/stationPos.csv', stationPositionMetadata)

// StationIdList. May contain Null values.
// fileOut4 = fs.writeFileSync('../assets/stationList.json', JSON.stringify(StationIdArr))

// Lines that this id used. Never Used. 
// fileOut5 = fs.writeFileSync('../assets/stationLineList.json', JSON.stringify(stationLineArr))

console.log(`iterations: ${iterations}`)