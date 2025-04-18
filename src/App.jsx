import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SearchFeed from './pages/searchFeed'
import Video from './pages/Video'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/searchFeed' element={<SearchFeed/>}/>
        <Route path="/video/:vpid" element={<Video />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App