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
    useEffect(() => {
      const handleMouseMove = (event) => {
        const loader = document.getElementById('loader');
        if(loader){
          const menuWidth = 260;
          const hoverAreaWidth = 250; // Area on the left side to detect hover
          
          if (event.clientX <= hoverAreaWidth) {
            loader.classList.add("minimized");
          } else {
            loader.classList.remove("minimized");
          }
        }        
      };
  
      document.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);
  return (
    <div>{context.loaderState &&
      <div className="loader-container flex-column" id="loader">
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
