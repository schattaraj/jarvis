import { useEffect } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import Skeleton from "@mui/material/Skeleton";
import { ScrollPanel } from "primereact/scrollpanel";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const baseVidURL = `https://jharvis.com/JarvisV2/playVideo?fileName=`;

const VideoComponent = () => {
  const [videoes, setVideoes] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const fetchVideoes = async () => {
    try {
      const apiCall = await fetch(
        "https://jharvis.com/JarvisV2/getAllAnalystVideo?filterText=&_=1699861659729"
      );
      const response = await apiCall.json();
      setVideoes(response);
      // setCurrentVideo(
      //   `https://jharvis.com/JarvisV2/playVideo?fileName=${response[0].anaylstVideoDetails}`
      // );
      console.log(response);
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    fetchVideoes();
  }, []);

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoes.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videoes.length - 1 : prevIndex - 1
    );
  };
  const onProgress = (played, loaded, playedSecond, loadedSecond) => {
    console.log(
      "\nplayed=",
      played,
      " loaded=",
      loaded,
      " playedSecond=",
      playedSecond,
      " loadedSecond=",
      loadedSecond,
      "\n"
    );
  };

  return (
    <Grid container>
      <Grid item xs={12} sx={{ border: 1 }} style={{ height: "120px" }}></Grid>
      <Grid item xs={12} md={8} sx={{ border: 1 }}>
        {videoes.length > 0 ? (
          <>
            {" "}
            <div className="player-wrapper">
              <ReactPlayer
                className="react-player"
                url={`${baseVidURL}${videoes[currentVideoIndex]?.anaylstVideoDetails}`}
                controls
                playing={true}
                onProgress={onProgress}
                width={"100%"}
              />
            </div>
            <div>
              <Tooltip title="Previous" placement="right-start">
                <IconButton
                  onClick={handlePrevVideo}
                  aria-label="Previous"
                  color="primary"
                >
                  <SkipPreviousIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next" placement="right-start">
                <IconButton
                  onClick={handleNextVideo}
                  aria-label="Next"
                  color="primary"
                >
                  <SkipNextIcon />
                </IconButton>
              </Tooltip>

              <span>{videoes[currentVideoIndex].companyName}</span>
              <span>ID {videoes[currentVideoIndex].idAnaylstVideo}</span>
            </div>
          </>
        ) : (
          <div>
            <Skeleton variant="rounded" width={"100%"} height={"100%"} />
          </div>
        )}
      </Grid>
      <Grid item xs={12} md={4} paddingX={4} sx={{ border: 1 }}>
        <ScrollPanel style={{ width: "100%", height: "400px" }} >
          {videoes.map((item, index) => {
            <Card sx={{ maxWidth: 345 }} key={index}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.companyName}
                </Typography>
              </CardContent>
            </Card>;
          })}
        </ScrollPanel>
      </Grid>
    </Grid>
  );
};

export default VideoComponent;
