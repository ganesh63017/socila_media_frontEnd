import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Avatar, Card, Stack } from "@mui/material";
import SlideShow from "./SlideShow";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Comments from "./Comments";
import Skeleton from "@mui/material/Skeleton";

const baseUrl = "http://localhost:8080";
const Feed = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const state = useSelector((state) => state);

  useEffect(() => {
    getPostData();
    getAllComments();
    getUserData();
  }, []);

  const getUserData = async () => {
    const url = `http://localhost:8080/users/${
      state && state.userData.user._id
    }`;

    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "originalUserData", payload: data.user });
    }
  };

  const getAllComments = async () => {
    const url = "http://localhost:8080/feeds/comments";
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "commentsData", payload: data.data });
    }
  };

  const getPostData = async () => {
    dispatch({ type: "loading", payload: true });
    const url = `${baseUrl}/feeds/posts`;
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      setTimeout(() => {
        dispatch({ type: "postData", payload: data });
        dispatch({ type: "loading", payload: false });
      }, 300);
    }
  };

  const getTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
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
        state.postData?.map((each) => {
          const date1 = new Date(each.createdAt);
          const date2 = new Date();
          const diffInMS = Math.abs(date2 - date1);
          const diffInDays = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
          const diffInHours = diffInMS / (1000 * 60 * 60);
          var rHours = Math.floor(diffInHours);
          var min = (diffInHours - rHours) * 60;
          var minutes = Math.round(min);

          return (
            <Card
              key={each._id}
              style={{
                width: "608px",
                minHeight: "50vh",
                boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    alignItems: "center",
                    width: "400px",
                  }}
                >
                  {each.created_by.profile_pic !== "" ? (
                    <Avatar
                      style={{ position: "inherit" }}
                      src={`${baseUrl}/${each.created_by.profile_pic}`}
                    />
                  ) : (
                    <Avatar className="m-0" style={{ position: "inherit" }} />
                  )}

                  <div
                    style={{
                      width: "100%",
                      marginLeft: "2vh",
                    }}
                  >
                    <p
                      className="m-0"
                      style={{
                        fontFamily: "Public Sans",
                        fontWeight: "600",
                        width: "100%",
                      }}
                    >
                      {each.created_by.lastName}
                    </p>
                    <p
                      className="m-0"
                      style={{ color: "#838582", fontSize: "14px" }}
                    >
                      {each.location}
                    </p>
                  </div>
                </div>
              </div>
              {each.posted_photos.length > 1 ? (
                <SlideShow slideImages={each.posted_photos} />
              ) : (
                <div>
                  <img
                    src={`${baseUrl}/${each.posted_photos[0]}`}
                    alt="pic"
                    width="608"
                    height="550"
                  />
                </div>
              )}
              <Comments
                time={getTime(date1)}
                id={each._id}
                getPostData={getPostData}
                getAllComments={getAllComments}
              />
            </Card>
          );
        })}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={state.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack spacing={1}>
        <Skeleton variant="text" />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={600} height={128} />
      </Stack>
    </div>
  );
};

export default Feed;
