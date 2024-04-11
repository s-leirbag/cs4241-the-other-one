import './App.css'
import LinePlot from './LinePlot'
import chinaData from './assets/ChinaPop.json'
import indData from './assets/IndPop.json'
import usData from './assets/USPop.json'

function Graph(date_range_min, date_range_max) {
    const usPop = usData[1]
    let graphData = []
    let popData = usData[1].map(function(data){
        if (data.date >= date_range_min && data.date <= date_range_max){
            graphData.append(data.value)
        }
    })
    return (
        <LinePlot
          data={graphData}
        />
    )
}

export default Graph
