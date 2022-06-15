import React, { useEffect } from "react";
import { Avatar, Card, Stack } from "@mui/material";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import Moment from 'react-moment';



const baseUrl = "http://localhost:8080";

const Reel = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  console.log(state);

  useEffect(() => {
    getData();
    dispatch({ type: "videoUpload", payload: true });
  }, []);

  const getData = async () => {
    dispatch({ type: "loading", payload: true });
    const url = "http://localhost:8080/video";
    const options = {
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${state.userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setTimeout(() => {
        dispatch({ type: "loading", payload: false });
        dispatch({ type: "reels", payload: data.data });
      }, 1000);
    }
  };

  const s = {
    width: "700px",
    minHeight: "600px",
    boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
    margin: "5px",
    cursor: "pointer",
  };

  const getTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
      return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        height: "100%",
        position: "inherit",
        paddingBottom: "30vh",
        fontFamily: "Public-Sans",
        color: "#000608",
        fontWeight: 800,
      }}
    >
      {state &&
        state.reels.map((each) => {
          return (
            <Card style={s}>
              <ReactPlayer
                playing={true}
                controls={true}
                width={700}
                height={500}
                volume={1}
                muted={true}
                url={each.url}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignContent: "center",
                  padding: "20px",
                }}
              >
                <div>
                  <p>{each.title}</p>
                  {/* <p>{getTime(each.createdAt)}</p> */}
                  <Moment className="moment-edit" fromNow>{each.createdAt}</Moment>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    padding: "20px",
                    minWidth: "200px",
                  }}
                >
                  {each.likes.includes(state.userData.user._id) ? (
                    <ThumbUpIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                  {each.likes.length > 0 && <p>{each.likes.length} Likes</p>}
                  {each.likes.includes(state.userData.user._id) ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownOffAltIcon />
                  )}
                  {each.likes.length > 0 ? <p>{each.likes.length} DISLIKE </p>:<p>DISLIKE</p>}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "150px",
                  margin: "20px",
                  alignContent: "center",
                }}
              >
                {each.created_by.profile_pic === "" ? (
                  <Avatar></Avatar>
                ) : (
                  <Avatar
                    style={{ position: "inherit" }}
                    src={`${baseUrl}/${each.created_by.profile_pic}`}
                  />
                )}
                <p>{each.created_by.lastName}</p>
              </div>
            </Card>
          );
        })}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Reel;
