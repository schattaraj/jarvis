import React, { useEffect, useState, useRef } from "react";
import Footer from "../../components/footer";
import Navigation from "../../components/navigation";
import Sidebar from "../../components/sidebar";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Breadcrumb from "../../components/Breadcrumb";
import { fetchWithInterceptor, formatDate } from "../../utils/utils";
import ReactPlayer from "react-player";

export default function Podcast() {
  const [podcasts, setPodcasts] = useState([]);
  const [podcastsFiltered, setPodcastsFiltered] = useState([]);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [orderBy, setOrderBy] = useState("asc");
  const [fromYear, setFromYear] = useState("2024");
  const [toYear, setToYear] = useState("2025");
  const [currentPodcast, setCurrentPodcast] = useState({
    description: "/assets/music.mp4",
    podCastsDetails: "/assets/music.mp4",
  });

  const audioRef = useRef(null);
  const fetchPodcasts = async () => {
    setLoader(true);
    try {
      const response = await fetchWithInterceptor(
        "/api/proxy?api=getAllPodCasts?filterText=&_=1707116098092"
      );
      // const response = await apiCall.json();
      setPodcasts(response);
      // Apply initial filter based on default year range
      const filteredPodcasts = response.filter(
        (podcast) =>
          new Date(podcast.podCastDate).getFullYear() >=
            new Date(fromYear).getFullYear() &&
          new Date(podcast.podCastDate).getFullYear() <=
            new Date(toYear).getFullYear()
      );
      setPodcastsFiltered(filteredPodcasts);
    } catch (e) {
      console.log("error", e);
    }
    setLoader(false);
  };
  const filter = async () => {
    setLoader(true);
    try {
      const filteredPodcasts = podcasts.filter(
        (podcast) =>
          new Date(podcast.podCastDate).getFullYear() >=
            new Date(fromYear).getFullYear() &&
          new Date(podcast.podCastDate).getFullYear() <=
            new Date(toYear).getFullYear()
      );
      // Apply sorting immediately after filtering
      const sortedPodcasts =
        orderBy === "asc"
          ? sortPodcastsOldestToNewest([...filteredPodcasts])
          : sortPodcastsNewestToOldest([...filteredPodcasts]);
      setPodcastsFiltered(sortedPodcasts);
    } catch (e) {
      console.log("error", e);
    }
    setLoader(false);
  };
  const handleClose = () => setShow(false);
  const handleShow = (path) => {
    setCurrentPodcast(path);
    setShow(true);
  };
  const handleSeeking = (e) => {
    console.log(e.target);
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime) && isFinite(newTime) && audioRef.current) {
      audioRef.current.audio.current.currentTime = newTime;
    }
  };
  useEffect(() => {
    fetchPodcasts();
  }, []);
  useEffect(() => {
    filter();
  }, [fromYear, toYear, orderBy]);
  const handleOrder = (e) => {
    setOrderBy(e.target.value);
  };
  const sortPodcastsNewestToOldest = (podcasts) => {
    return podcasts.sort(
      (a, b) => new Date(b.podCastDate) - new Date(a.podCastDate)
    );
  };
  const sortPodcastsOldestToNewest = (podcasts) => {
    return podcasts.sort(
      (a, b) => new Date(a.podCastDate) - new Date(b.podCastDate)
    );
  };
  const handleFromYearChange = (e) => {
    const newFromYear = e.target.value;
    setFromYear(newFromYear);
    // If To year is less than new From year, update To year to match From year
    if (parseInt(newFromYear) > parseInt(toYear)) {
      setToYear(newFromYear);
    }
  };

  const handleToYearChange = (e) => {
    const newToYear = e.target.value;
    // Only allow To year to be greater than or equal to From year
    if (parseInt(newToYear) >= parseInt(fromYear)) {
      setToYear(newToYear);
    }
  };
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper" style={{ position: "relative" }}>
          <Breadcrumb />
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home"></i>
              </span>
              Podcast
            </h3>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex dt-buttons mb-3">
              <div className="d-flex align-items-center me-2">
                <label
                  htmlFor="fromYear"
                  style={{ textWrap: "nowrap" }}
                  className="text-success me-2"
                >
                  From:{" "}
                </label>
                <select
                  id="fromYear"
                  className="form-select me-3"
                  value={fromYear}
                  onChange={handleFromYearChange}
                  style={{ maxWidth: "120px" }}
                >
                  {Array.from({ length: 14 }, (_, i) => 2015 + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <label
                  htmlFor="toYear"
                  style={{ textWrap: "nowrap" }}
                  className="text-success me-2"
                >
                  To:{" "}
                </label>
                <select
                  id="toYear"
                  className="form-select"
                  value={toYear}
                  onChange={handleToYearChange}
                  style={{ maxWidth: "120px" }}
                >
                  {Array.from(
                    { length: 14 - (parseInt(fromYear) - 2015) },
                    (_, i) => parseInt(fromYear) + i + 1
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex align-items-center me-2">
              <label
                htmlFor=""
                style={{ textWrap: "nowrap" }}
                className="text-success me-2"
              >
                Sort By :{" "}
              </label>
              <select
                name="orderType"
                className="form-select"
                onChange={handleOrder}
                style={{ maxWidth: "200px", marginRight: "8px" }}
              >
                <option value="asc">Oldest to newest</option>
                <option value="desc">Newest to oldest</option>
              </select>
            </div>
          </div>
          <div className="podcast-area">
            <div className="row">
              {podcastsFiltered.map((item, index) => {
                const result = item?.podCastsDetails;
                return (
                  <div className="col-md-4" key={"podcast" + index}>
                    <div className="card p-2">
                      <img
                        className="card-img-top"
                        src="/images/PodcastTN.png"
                        alt="Card image cap"
                      />
                      <button
                        className="play-btn bg-gradient-primary"
                        onClick={() => {
                          handleShow(item);
                        }}
                      >
                        <img src="/icons/play.svg" alt="" />
                      </button>
                      <p className="text-center my-2">
                        {result.startsWith("C:/JarvisPDF/")
                          ? result.slice("C:/JarvisPDF/".length)
                          : result}
                      </p>
                      <p className="text-center">
                        {formatDate(item.podCastDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className={
                show ? "fixed-audio-player" : "fixed-audio-player d-none"
              }
            >
              <h4 className="ps-3">{currentPodcast.description}</h4>
              {/* <ReactPlayer
                className="react-player"
                style={{ borderRadius: "10px" }}
                url={`https://jharvis.com/JarvisV2/playVideo?fileName=${currentPodcast.podCastsDetails}`}
                controls
                playing={true}
                // onProgress={onProgress}
                width={"100%"}
              /> */}
              <AudioPlayer
                autoPlay={false}
                src={
                  "/api/image-proxy?path=http://35.226.245.206:9092/JarvisV3/" +
                  currentPodcast.podCastsDetails.split("C:/")[1]
                  // "/assets/music.mp3"
                  // "/api/proxy?api=playVideo?fileName=" +
                  // currentPodcast.podCastsDetails
                }
                onPlay={(e) => console.log("onPlay", currentPodcast)}
                // other props here
                showJumpControls={true}
                ref={audioRef}
                onSeeking={handleSeeking}
                // onListen={(e) => console.log('current time:', e.target.currentTime)}
              />
            </div>
          </div>
          {loader && (
            <div
              className="loader-area"
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100vh",
                left: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            >
              <span className="loader"></span>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
