import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <Link to="/searchFeed">Videos</Link>
        <Link to="/schemes">Schemes For Woman</Link>
    </div>
  )
}

export default Home