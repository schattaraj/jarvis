import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function chartIndex() {
    const router = useRouter()
    useEffect(()=>{
router.push("/marketAnalytics/stocks")
    },[])
  return (
    <>index</>
  )
}

export default chartIndex