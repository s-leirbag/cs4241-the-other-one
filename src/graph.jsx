import './App.css'
import LinePlot from './LinePlot'
import chinaData from './assets/ChinaPop.json'
import indData from './assets/IndPop.json'
import usData from './assets/USPop.json'
import {useEffect, useState} from "react";


function Graph(date_range_min, date_range_max) {
    const [data, setData] = useState()

    useEffect(() => {
        let graphData = []
        usData[1].map(function(data){
            if (data.date >= date_range_min && data.date <= date_range_max){
                graphData.append(data.value)
            }
        })
        setData(graphData);
    }, []);

    console.log(usData);
    console.log(graphData)
    return (
        <LinePlot
          data={data}
        />
    )
}

export default Graph
