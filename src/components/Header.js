import React from 'react'
import { IMAGE_URL } from '../utils/contents'
import Search from './Search'


const Header = () => {
  return (
    <div style={{textAlign:"center"}}>
        <img src={IMAGE_URL} alt="logo" style={{marginTop:"10px"}}/>
        <Search />
    </div>
  )
}

export default Header