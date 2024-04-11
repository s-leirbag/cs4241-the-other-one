import './App.css'
import LinePlot from './LinePlot'
import chinaPop from './assets/ChinaPop.json'
import indiaPop from './assets/IndPop.json'
import usPop from './assets/USPop.json'

function Graph({data}) {
    // const unemploymentData = [
    //   { date: new Date('2023-01-01'), unemployment: 200, division: 'US' },
    //   { date: new Date('2020-02-01'), unemployment: 4.7, division: 'US' },
    //   { date: new Date('2020-01-01'), unemployment: 3.5, division: 'China' },
    //   { date: new Date('2020-02-01'), unemployment: 3.7, division: 'China' },
    //   // ... more data points
    // ];

    // console.log(chinaPop[1])

    const d = []

    for (const entries of [chinaPop[1], indiaPop[1], usPop[1]]) {
        for (const entry of entries) {
            // console.log(entry)
            d.push({
                date: new Date(entry.date + '-01-01'),
                unemployment: entry.value ? entry.value : 0,
                division: entry.country.value
            })
        }
    }

    return (
        <LinePlot
          data={d}
        />
    )
}

export default Graph
