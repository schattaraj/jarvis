import React, { useContext, useState } from 'react'
import { Context } from '../contexts/Context'
export default function Loader() {
  const context = useContext(Context)
  return (
    <div>{context.loaderState &&
        <div className="loader-container">
        <div className='loader'></div>
        </div>
        }
        </div>
  )
}
