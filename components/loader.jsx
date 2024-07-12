import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../contexts/Context'
export default function Loader() {
  const context = useContext(Context)
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
  useEffect(() => {
    let timer;
    if (context.loaderState) {
      timer = setTimeout(() => {
        setShowLongWaitMessage(true);
      }, 10000);
    } else {
      setShowLongWaitMessage(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [context.loaderState]);
  return (
    <div>{context.loaderState &&
      <div className="loader-container flex-column">
        <div className='loader'></div>
        {showLongWaitMessage && <div className='text-white mt-2 display-5 loading-message' style={{ fontWeight: "600" }}>Sit tight, we're fetching the data for you!!
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          </div>}
      </div>
    }
    </div>
  )
}
