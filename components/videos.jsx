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
  SvgIcon,
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

  console.log("Videos", videoes);

  return (
    <Grid container>
      <Grid container item xs={12} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)', marginBottom: '4px' }}>

        <Grid container item xs={6} justifyContent="flex-start" alignItems="center">
          {/* <Grid item>
            <img
              id="dimg_1"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAUVBMVEX///9mZmZeXl5iYmJXV1daWlqlpaXBwcH8/Py0tLRubm6rq6vw8PCIiIiBgYHc3Nz29vbQ0NCfn590dHTj4+OQkJDq6upSUlKWlpbHx8e6urpx1ZffAAABmElEQVRIib2W65KDIAyFIQQvULRg1db3f9AFu91tazTQmd38ZOabE5KTgBB/GX3dfECdg9bzuZyrUUkJ5YoVyhimmLM6cepayvlVT2pfyDVq5coztbByWCoo7noQSrnLekNwpZy4pUz1WMyJBUHLupwTfbD5ZTnVYXTXZfo5aHrrBjM42x9hF4egYgAae0kHfgQNqZvqMGuL3x1PxURTBaV/D2Kdup0hcVq+hFLy7UCeKG4EyYUyxHy1muViDtsSTchz4AhB934hQo8y3zTzguR0WV4QSQsYPtGO4k58aYA0jud7gRMF1nzzgeJEy4PyU5BedRmg+hREcqZyikOukZ5vhyLXXYYBdhrJW3XHcxlTJXVLgEuGAyQSds1ZAJGstiQ/VynAbJqS49ZEbl71c1au1Bq4ZtSVtHpWefSN6MiYI0lwObYjBTMKS5suxsAki+RjlZI9Hi6kE03hj6657f3zNZ9JBc9PK+xd8B4WHxAOwYYOH485w6VfUdSBuavvhWh8iN8HgJmYiw0aKv/ygPaLbcm18b/xBf8tD08u8Xy+AAAAAElFTkSuQmCC"
              className="YQ4gaf zr758c wA1Bge"
              height="56"
              width="56"
              alt=""
              data-atf="1"
              data-frt="0"
            />
          </Grid> */}
          <Grid iten>
          {videoes.length > 0 ? (
            <>
            <Typography sx={{ fontSize: "28px" }}>{videoes[currentVideoIndex].companyName}</Typography>
            <Typography sx={{ fontSize: "14px" }}>{videoes[currentVideoIndex].tickerName}</Typography>
            </>
          ) : ""}
          </Grid>
        </Grid>

        {/* <Grid container item xs={6} justifyContent='flex-end'>
          <Grid item container justifyContent='flex-end' alignItems='flex-end'>
            <Typography sx={{ fontSize: '28px' }}>
              189.71
            </Typography>
            <Typography sx={{ fontSize: '14px', color: 'rgba(0,0,0,.62)' }}>
              USD
            </Typography>
          </Grid>
          <Grid item >
            <Typography variant="body1">
              <span>
                +1.70{' '}
                <span>
                  (0.60%)
                  <SvgIcon viewBox="0 0 18 18" color='Green'>
                    <path d="M6,0.002L0 6.002 4.8 6.002 4.8 11.9996 7.2 11.9996 7.2 6.002 12 6.002z"></path>
                  </SvgIcon>
                </span>
              </span>
            </Typography>
          </Grid>
        </Grid> */}

      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={12} md={8}>
          {videoes.length > 0 ? (
            <>
              {" "}
              <div className="player-wrapper" style={{ border: '1px solid rgba(0, 0, 0, 0.3)', borderRadius: '4px' }}>
                <ReactPlayer
                  className="react-player"
                  style={{ borderRadius: '10px' }}
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

                {/* <span>{videoes[currentVideoIndex].companyName}</span>
                <span>ID {videoes[currentVideoIndex].idAnaylstVideo}</span> */}
              </div>
            </>
          ) : (
            <div>
              <Skeleton variant="rounded" width={"100%"} height={"100%"} />
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <ScrollPanel style={{
            width: "100%", height: "460px"
          }}>
            {videoes.map((item, index) => {

              return (
                <Card
                  sx={{
                    m: 2,
                    maxWidth: 240,
                    opacity: index === currentVideoIndex ? 0.7 : 1,
                    "&:hover": { opacity: index === currentVideoIndex ? 0.7 : 1 },
                    border: index === currentVideoIndex ? '1px solid rgba(0, 0, 0, 0.4' : '1px solid rgba(0, 0, 0, 0.2',
                    boxShadow:
                      "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                  }}
                  key={index} style={{ border: '1px solid rgba(0, 0, 0, 0.2' }}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    sx={{ height: "140px", cursor: 'pointer' }}
                    image="/images/VideoTN.png"
                    style={{ border: '1px solid rgba(0, 0, 0, 0.2', objectFit: 'cover' }}
                    onClick={() => setCurrentVideoIndex(index)}
                  />
                  <CardContent>
                    <Typography sx={{ fontSize: '14px' }}>
                      {item.companyName}
                    </Typography>
                  </CardContent>
                </Card>
              )
            })
            }
          </ScrollPanel>
        </Grid>

      </Grid>

    </Grid >
  );
};

export default VideoComponent;
