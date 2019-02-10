var fs = require('fs');
const simpleInputs = ["A-B-C", "A-D", "A-D-C", "A-E-B-C-D", "A-E-D"];
var outputNumber = 1;

fs.readFile('import.txt', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    let brokenStrings = breakString(data)
    const tracks = nodeFinder(brokenStrings)
    inputHandler(tracks)
})

function inputHandler(tracks) {
    simpleInputs.map(input => {
        calcRoute(multiRouteBreaker(input), tracks)
    })
    findMultiRoute('C', 'C', tracks, 3, 'atmost')
    findMultiRoute('A', 'C', tracks, 4, 'exactly')
    findMultiRoute('A', 'C', tracks, 10, 'shortestroute')
    findMultiRoute('B', 'B', tracks, 10, 'shortestroute')
    routeCount('C', 'C', tracks, 30)

}

function breakString(fullString) {
    let processedString = []
    if (fullString.indexOf(',') > -1) {
        processedString = fullString.split(',')
    }
    processedString.map(function processString(route, index) {
        processedString[index] = route.substring((route.length - 3), route.length)
    })
    return processedString
}

function nodeFinder(brokenStrings) {
    let tracks = []
    brokenStrings.map(function mapNodes(node) {
        let trackObject = {
            startNode: node.substring(0, 1),
            endNode: node.substring(1, 2),
            distance: parseInt(node.substring(2, 3))
        }
        tracks.push(trackObject)
    })
    return tracks
}

function multiRouteBreaker(string) {
    let brokenString = string.split('-')
    return (brokenString)
}

function calcRoute(nodes, tracks) {
    let output = 0
    for (let i = 0; i < nodes.length - 1; i++) {
        if (singleDistance(nodes[i], nodes[i + 1], tracks)) {
            output = output + singleDistance(nodes[i], nodes[i + 1], tracks)
        } else { output = "NO SUCH ROUTE" }
    }
    outputHandler(output)
}

function singleDistance(start, end, tracks) {
    let foundTrack = false
    tracks.map(track => {
        if (track.startNode === start && track.endNode === end) {
            foundTrack = track.distance
        }
    })
    return foundTrack
}




function findMultiRoute(start, end, tracks, stopMax, outputType) {
    let foundPaths = optionMultiFirst(start, tracks)
    let succesfulPaths = []
    for (let i = 2; i < stopMax; i++) {
        foundPaths = optionMulti(foundPaths, tracks)
        if (outputType != 'exactly') {
            foundPaths.map((path, index) => {
                if (path[path.length - 1].endNode === end) {
                    succesfulPaths.push(path)
                }
            })
        }
    }

    foundPaths = optionMultiLast(foundPaths, tracks, end)
    foundPaths.map(path => { succesfulPaths.push(path) })
    if (outputType === 'atmost' || outputType === 'exactly') {
        outputHandler(succesfulPaths.length)
    }
    if (outputType === 'shortestroute') {
        outputHandler(outputShortestLength(succesfulPaths, outputType))
    }
    if (outputType === 'routeCount') {
        return outputShortestLength(succesfulPaths, outputType)
    }
}

function routeCount(start, end, tracks, limit) {
    paths = findMultiRoute(start, end, tracks, 11, 'routeCount')
    let output = 0
    paths.map(path => {
        if (path < limit) {
            output++
        }
    })
    outputHandler(output)
}


function optionMultiFirst(start, tracks) {
    let foundPaths = []
    tracks.map((track, index) => {
        if (track.startNode === start) {
            foundPaths.push([track])
        }
    })
    return foundPaths
}

function optionMulti(paths, tracks) {
    let foundPaths = []
    paths.map((path, index) => {
        tracks.map(track => {
            if (track.startNode === path[path.length - 1].endNode) {
                let foundPath = JSON.parse(JSON.stringify(path))
                foundPath.push(track)
                foundPaths.push(foundPath)
            }
        })
    })
    return (foundPaths)
}
function optionMultiLast(paths, tracks, end) {
    let foundPaths = []
    paths.map(path => {
        tracks.map(track => {
            if (track.startNode === path[path.length - 1].endNode && end === track.endNode) {
                let foundPath = path
                foundPath.push(track)
                foundPaths.push(foundPath)
            }
        })
    })
    return (foundPaths)
}

function outputShortestLength(paths, outputType) {
    let pathDistances = []
    paths.map(path => {
        pathDistance = 0
        path.map(node => {
            pathDistance = pathDistance + node.distance
        })
        pathDistances.push(pathDistance)
    })
    var min = Math.min.apply(Math, pathDistances)
    if (outputType === "shortestroute") { return min }
    if (outputType === "routeCount") {
        return pathDistances
    }
}

function outputHandler(outputText) {
    console.log('Output # ', outputNumber, ' :', outputText)
    outputNumber++
}