import React, { useEffect, useState } from "react";
import Footer from "../../components/footer";
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import VideoComponent from "../../components/videos";
import Breadcrumb from '../../components/Breadcrumb';
export default function videoes() {

  return (
    <>
        <div className="main-panel">
        <div className="content-wrapper">
        <Breadcrumb />
          <VideoComponent />
        {/* <div className="page-header">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home"></i>
                </span>
                Videos
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span></span>Overview{" "}
                    <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                  </li>
                </ul>
              </nav>
            </div> */}

        {/* <div className="row">
          {currentVideo && (
            <>
              <div className="player-wrapper">
                <ReactPlayer
                  className="react-player"
                  url={`${baseVidURL}${videoes[currentVideoIndex].anaylstVideoDetails}`}
                  controls
                  playing={true}
                  light="/images/VideoTN.png"
                  width="640"
                  height="480"
                  // config={{
                  //   file: {
                  //     currentVideo,
                  //   },
                  // }}
                />
              </div>
              <div>
                <button onClick={handlePrevVideo}>Previous Video</button>
                <button onClick={handleNextVideo}>Next Video</button>
                <span>{videoes[currentVideoIndex].companyName}</span>
                <span>ID {videoes[currentVideoIndex].idAnaylstVideo}</span>
              </div>
            </>
          )}
          {videoes.map((item, index) => (
            <div key={index} className="col-md-4  grid-margin">
              <div
                onClick={() =>
                  setCurrentVideo(
                    `https://jharvis.com/JarvisV2/playVideo?fileName=${item.anaylstVideoDetails}`
                  )
                }
                style={{ border: "1px solid blue", cursor: "pointer" }}
              >
                <img src="/images/VideoTN.png" alt={`Video ${index}`} />
              </div>
            </div>
          ))}
        </div> */}
        </div>
        {/* <Footer /> */}
        </div>
        </>
  );
}

// <div
// className="col-md-4 stretch-card grid-margin"
// key={index}
// >
//   <div className="video">
//     <div className="overlay">
//       <img src="/images/VideoTN.png" className="image" />
//       <button className="play-btn">
//         <img src="/icons/play.svg" alt="" />
//       </button>
//     </div>
//     <video
//       src={
//         "https://jharvis.com/JarvisV2/playVideo?fileName=" +
//         item?.anaylstVideoDetails
//       }
//       controls
//       style={{ width: "100%" }}
//     ></video>
//   </div>
// </div>
