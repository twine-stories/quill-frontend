import React, { useContext } from "react";
import { Episode, NFTCollection, Work } from "../utils/types.ts";
import { AspectRatio, Card, IconButton, Stack, Typography } from "@mui/joy";
import TwineButton from "./TwineButton.tsx";
import { useNavigate } from "react-router-dom";
import { CHAPTER_IMGS_BUCKET } from "../config.ts";
import { COVER_PATH } from "../utils/aws.ts";
import { EpisodeOrderContext } from "../pages/Story.tsx";

interface EpisodeTileProps {
    episode: Episode
    isCreator: boolean
    totalEpisodes?: number
}

function EpisodeTile(props: EpisodeTileProps) {
    const context: object = useContext(EpisodeOrderContext)
    const moveUp: (id: number) => void = context['moveUp']
    const moveDown: (id: number) => void = context['moveDown']
    const deleteDraftChapter: (id: number) => void =
        context['deleteDraftChapter']

    let navigate = useNavigate()

  const stringToDate = (dateString: string) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <Stack
      className="card-view-story-parent"
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Card
        variant="outlined"
        className="card-view-story"
        id="card-view-story-id"
        onClick={() => {
          navigate("/chapter/" + props.episode["url"]);
        }}
      >
        {/*<AspectRatio variant="outlined" ratio="16/9">*/}
        <img
          className="episode-tile-img"
          id='img-episode'
          src={
            props.episode &&
            "https://" +
              CHAPTER_IMGS_BUCKET +
              ".s3.amazonaws.com/" +
              COVER_PATH +
              props.episode["cover"]
          }
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286";
          }}
          loading="lazy"
          alt=""
          style={{
            aspectRatio: "1.5/1",
            width: "25%",
            height: "18%",
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
        {/*</AspectRatio>*/}
        <div
          className="date-title"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            alignItems: "left",
            width: "100%",
          }}
        >
          <Typography
            level="h6"
            color="white"
            sx={{ margin: "0px" }}
            className="view-story-h6"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
            {props.publishedEpisodes && (<div
                className="chapter-num"
                id="chapter-num-id"
              >
                Ch.{props.idx + 1}
              </div>)}
              {props.publishedEpisodes && (<div
                className="dot-icon"
                id="dot-icon-id"
              >
                <img src="/icons/dot.svg" width="2px" height="2px" />
              </div>)}
              <div
                className="episode-date"
                id="episode-date-id"
              >
                {props.episode && stringToDate(props.episode["publishStamp"])}
              </div>
            </div>
          </Typography>
          <Typography
            level="h2"
            color="white"
            sx={{ minWidth: "600px", margin: "0px", fontSize: "40px" }}
            className="view-story-h2"
          >
            {props.episode && props.episode["title"]}
          </Typography>
        </div>
      </Card>
      {props.isCreator && (
        <Stack direction="column" alignItems="center">
          {props.episode.episodeNumber !== -1 &&
            props.episode.episodeNumber !== 0 && (
              <IconButton
                onClick={function () {
                  moveUp(props.episode.episodeNumber);
                }}
                variant="plain"
                color="neutral"
                sx={{
                  ml: "auto",
                  "&:hover": {
                    backgroundColor: "#0d0603",
                  },
                }}
              >
                <div className="arrow-button">
                  <img
                    className="hover-arrow-up-img"
                    alt="arrowimg"
                    src="/icons/hover-purple-arrow-up.svg"
                    width="30px"
                    height="30px"
                  />
                  <img
                    className="arrow-up-img"
                    alt="arrowimg"
                    src="/icons/purple_arrow_up.svg"
                    width="30px"
                    height="30px"
                  />
                </div>
              </IconButton>
            )}
          {props.episode.episodeNumber !== -1 &&
            props.episode.episodeNumber !== props.totalEpisodes - 1 && (
              <IconButton
                onClick={function () {
                  moveDown(props.episode.episodeNumber);
                }}
                variant="plain"
                color="neutral"
                sx={{
                  ml: "auto",
                  "&:hover": {
                    backgroundColor: "#0d0603",
                  },
                }}
              >
                <img
                  className="arrow-button-down"
                  alt="arrowimg"
                  src="/icons/purple_arrow_down.svg"
                  width="30px"
                  height="30px"
                />
                <img
                  className="hover-arrow-button-down"
                  alt="arrowimg"
                  src="/icons/hover-purple-arrow-down.svg"
                  width="30px"
                  height="30px"
                />
              </IconButton>
            )}
        </Stack>
      )}
      <Stack direction="column" alignItems="center" className="remove-del-img">
        {props.episode.episodeNumber === -1 && (
          <IconButton
            onClick={function () {
              deleteDraftChapter(props.episode.id);
            }}
            variant="plain"
            color="neutral"
            sx={{
              ml: "auto",
              "&:hover": {
                backgroundColor: "#0d0603",
              },
            }}
          >
            <img src="/icons/red_remove.svg" width="30px" height="30px" className="remove-img"/>
            <img src="/icons/hover_red_remove.svg" width="30px" height="30px" className="remove-img-hover"/>
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}

export default EpisodeTile