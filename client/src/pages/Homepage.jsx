import React from 'react'
import Navigationbar from '../components/Navigationbar'

function Homepage({data}) {
  return (
    <div>
      
    <Navigationbar />
  <h1>Full-Stack React and Express</h1>
  {data ? <p>{data.message}</p> : <p>Loading...</p>}

</div>
)
}

export default Homepage
