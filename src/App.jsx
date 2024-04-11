import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Graph from "./graph.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <h1>GRAPH</h1>
        <Graph />
    </div>
  )
}

export default App
