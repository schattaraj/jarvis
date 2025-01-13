import React, { useEffect, useState, useRef } from 'react'
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import Sidebar from '../../components/sidebar';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Breadcrumb from '../../components/Breadcrumb';
export default function Podcast() {
  const [podcasts, setPodcasts] = useState([])
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false)
  const [currentPodcast, setCurrentPodcast] = useState({ description: '/assets/music.mp4', podCastsDetails: '/assets/music.mp4' })
  const audioRef = useRef(null);
  const fetchPodcasts = async () => {
    setLoader(true)
    try {
      const apiCall = await fetch("/api/proxy?api=getAllPodCasts?filterText=&_=1707116098092")
      const response = await apiCall.json()
      setPodcasts(response)
    }
    catch (e) {
      console.log("error", e)
    }
    setLoader(false)
  }

  const handleClose = () => setShow(false);
  const handleShow = (path) => {
    setCurrentPodcast(path)
    setShow(true)
  }
  const handleSeeking = (e) => {
    console.log(e.target)
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime) && isFinite(newTime) && audioRef.current) {
      audioRef.current.audio.current.currentTime = newTime;
    }
  };
  useEffect(() => {
    fetchPodcasts()
  }, [])

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper" style={{ position: 'relative' }}>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>Podcast
            </h3>
          </div>
          <div className="podcast-area">
            <div className="row">
              {
                podcasts.map((item, index) => (
                  <div className="col-md-4" key={'podcast' + index}>
                    <div className="card p-2">
                      <img className="card-img-top" src="/images/PodcastTN.png" alt="Card image cap" />
                      <button className='play-btn bg-gradient-primary' onClick={() => { handleShow(item) }}>
                        <img src="/icons/play.svg" alt="" /></button>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className={show ? "fixed-audio-player" : 'fixed-audio-player d-none'}>
              <h4 className='ps-3'>{currentPodcast.description}</h4>
              <AudioPlayer
                autoPlay={false}
                src={"/api/proxy?api=playVideo?fileName=" + currentPodcast.podCastsDetails}
                onPlay={e => console.log("onPlay", currentPodcast)}
                // other props here
                ref={audioRef}
              // onSeeking={handleSeeking}
              // onListen={(e) => console.log('current time:', e.target.currentTime)}
              />
            </div>
          </div>
          {
            loader
            &&
            <div className="loader-area" style={{ position: 'absolute', top: 0, width: '100%', height: '100vh', left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <span className="loader"></span>
            </div>
          }
        </div>
        <Footer />
      </div>
    </>
  )
}
