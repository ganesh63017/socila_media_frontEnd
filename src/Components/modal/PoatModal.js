import React, { useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import InputEmoji from "react-input-emoji";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SlideShow from "../Home/Feed/SlideShow";
import GetReplies from "../Home/Feed/GetReplies";
import BASE_URL from '../service.js'

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const PoatModal = ({ id, openCommentSection, setOpenCommentSection }) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { commentsDataOfPost, userData, savedPost } = state;
  const currentPostData =
    state.postData && state.postData.filter((each) => each._id === id);
  const likesCount = currentPostData[0] && currentPostData[0].likes.length;

  const [{ postId, commentId }, setReplyDetails] = useState({
    postId: "",
    commentId: "",
  });

  const [showReplies, setReplyId] = useState("");

  const addLike = async () => {
    const url = `${BASE_URL}/feeds/likes/${id}`;
    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      getPostData();
    }
  };

  const getPostData = async () => {
    const url = `${BASE_URL}/feeds/posts`;
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: "postData", payload: data });
    }
  };

  const postComment = async (value) => {
    const url = `${BASE_URL}/feeds/comments/${id}`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify({ comment: value }),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      getPostData();
      getAllComments();
      getComment(id);
      setComment("");
    }
  };
  let inputRef = React.useRef(null);
  const replyToComment = async (value) => {
    inputRef.current.focus();
    setReplyDetails({ postId: id, commentId: value });
  };

  const getAllComments = async () => {
    const url = "${BASE_URL}/feeds/comments";
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "commentsData", payload: data.data });
    }
  };

  const addLikeToComment = async (id) => {
    const url = `${BASE_URL}/feeds/comments/likes/${id}`;

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      getComment();
    }
  };

  const getComment = async (value) => {
    setOpenCommentSection(true);
    const url = `${BASE_URL}/feeds/comments/${value ? value : id}`;
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: "commentsDataOfPost", payload: data.data });
      setOpenCommentSection(true);
    }
  };

  const [comment, setComment] = useState("");
  const handleOnEnterComment = async (text) => {
    if (postId === "") {
      postComment(text);
    } else {
      const url = `${BASE_URL}/feeds/comments/${postId}/${commentId}`;
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ comment: comment }),
      };
      const response = await fetch(url, options);

      if (response.ok) {
        setReplyDetails({ postId: "", commentId: "" });
        getComment();
      }
    }
  };

  const handleOnClickComment = async () => {
    if (postId === "") {
      postComment(comment);
    } else {
      const url = `${BASE_URL}/feeds/comments/${postId}/${commentId}`;
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({ comment: comment }),
      };
      const response = await fetch(url, options);
      if (response.ok) {
        setReplyDetails({ postId: "", commentId: "" });
        getComment();
        setComment("");
      }
    }
  };

  const getSavedPost = async () => {
    const url = "${BASE_URL}/feeds/save";
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "savedPost", payload: data.data });
    }
  };

  const savePost = async (id) => {
    const url = `${BASE_URL}/feeds/save/${id}`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);

    if (response.ok) {
      getSavedPost();
    }
  };

  const removeSavePost = async (id) => {
    const url = `${BASE_URL}/feeds/save/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);

    if (response.ok) {
      getSavedPost();
    }
  };

  const getTime = (min, hr, days) => {
    if (hr >= 24) {
      return `${days} days ago`;
    } else if (hr < 24 && hr >= 1) {
      return `${hr} hrs ago`;
    } else if (min < 60 && min >= 1) {
      return `${min} min ago`;
    } else {
      return "just now";
    }
  };

  const bookMark =
    savedPost &&
    savedPost.filter((each) => each.savedPost._id === currentPostData[0]?._id);

  const date1 = new Date(currentPostData[0] && currentPostData[0].createdAt);
  const date2 = new Date();
  const diffInMS = Math.abs(date2 - date1);
  const diffInDays = Math.ceil(diffInMS / (1000 * 60 * 60 * 24));
  const diffInHours = diffInMS / (1000 * 60 * 60);
  var rHours = Math.floor(diffInHours);
  var min = (diffInHours - rHours) * 60;
  var minutes = Math.round(min);

  return (
    <Modal
      open={openCommentSection}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        style={{
          width: "1450px",
          height: "760px",
          display: "flex",
          justifyContent: "space-evenly",
          padding: "0px",
        }}
      >
        <div>
          {currentPostData[0] &&
          currentPostData[0]?.posted_photos.length > 1 ? (
            <SlideShow
              slideImages={currentPostData[0].posted_photos}
              height={752}
              width={800}
            />
          ) : (
            <div>
              <img
                src={`${BASE_URL}/${currentPostData[0]?.posted_photos[0]}`}
                alt="pic"
                width="800"
                height="760"
              />
            </div>
          )}
        </div>
        <div
          style={{
            cursor: "pointer",
            justifyContent: "space-around",
            width: "700px",
            margin: "0px",
            borderBottom: "1px solid #d0d6ce",
            height: "14vh",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0px",
              height: "12vh",
              alignItems: "center",
              marginLeft: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginRight: "250px",
                marginTop: "20px",
              }}
            >
              {currentPostData[0] &&
              currentPostData[0]?.created_by?.profile_pic !== "" ? (
                <Avatar
                  src={`${BASE_URL}//${currentPostData[0].created_by.profile_pic}`}
                />
              ) : (
                <Avatar />
              )}
              <div>
                <p
                  style={{
                    marginLeft: "18px",
                    fontWeight: 600,
                    marginTop: "0px",
                    fontSize: "16px",
                    marginBottom: "0px",
                  }}
                >
                  {currentPostData[0] &&
                    currentPostData[0].created_by.firstName}
                  <p
                    style={{
                      color: "grey",
                      fontWeight: 500,
                    }}
                  >
                    {currentPostData[0] && currentPostData[0].location}
                  </p>
                  <p
                    style={{
                      fontWeight: 500,
                      fontSize: "18px",
                    }}
                  >
                    {currentPostData[0] && currentPostData[0].caption}
                  </p>
                </p>
              </div>
            </div>
            <div>
              <ClearIcon
                onClick={() => setOpenCommentSection(false)}
                style={{ marginBottom: "20px", marginLeft: "20px" }}
              />
              <p style={{ color: "grey", fontSize: "14px" }}>
                {getTime(minutes, rHours, diffInDays)}
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              height: "400px",
              overflow: "scroll",
            }}
          >
            {state.commentsDataOfPost?.map((each) => {
              const date1 = new Date(each.createdAt);
              const date2 = new Date();
              const diffInMS = Math.abs(date2 - date1);
              const diffInDays = Math.ceil(diffInMS / (1000 * 60 * 60 * 24));
              const diffInHours = diffInMS / (1000 * 60 * 60);
              var rHours = Math.floor(diffInHours);
              var min = (diffInHours - rHours) * 60;
              var minutes = Math.round(min);

              return (
                <>
                  <div
                    key={each._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "550px",
                      alignItems: "center",
                      marginLeft: "0px",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {each?.created_by?.profile_pic !== "" ? (
                          <Avatar
                            src={`${BASE_URL}//${each.created_by.profile_pic}`}
                          />
                        ) : (
                          <Avatar />
                        )}
                        <p
                          style={{
                            marginLeft: "20px",
                          }}
                        >
                          {each.created_by.firstName}
                        </p>
                        <p style={{ color: "grey", marginLeft: "20px" }}>
                          {each.comment}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p style={{ color: "grey", marginLeft: "60px" }}>
                          {getTime(minutes, rHours, diffInDays)}
                        </p>
                        <p
                          style={{
                            color: "grey",
                            marginLeft: "20px",
                            fontWeight: 600,
                          }}
                          onClick={() => {
                            replyToComment(each._id);
                          }}
                        >
                          Reply
                        </p>
                      </div>
                      {each.comments.length > 0 && (
                        <p
                          onClick={() => setReplyId(each._id)}
                          style={{
                            marginLeft: "80px",
                            marginTop: "0px",
                            color: "grey",
                            fontWeight: "600",
                          }}
                        >
                          __{each.comments.length} Replied
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "centers",
                      }}
                    >
                      {each.likes.includes(
                        userData.user && userData.user._id
                      ) ? (
                        <FavoriteIcon
                          onClick={() => addLikeToComment(each._id)}
                          style={{
                            marginLeft: "40px",
                            cursor: "pointer",
                            color: "red",
                          }}
                        />
                      ) : (
                        <FavoriteBorderOutlinedIcon
                          onClick={() => addLikeToComment(each._id)}
                          style={{
                            marginLeft: "40px",
                            cursor: "pointer",
                          }}
                        />
                      )}
                      {each.likes.length > 0 && (
                        <p
                          style={{
                            marginLeft: "26px",
                            marginTop: "5px",
                          }}
                        >
                          {each.likes.length} likes
                        </p>
                      )}
                    </div>
                  </div>
                  {showReplies !== "" && showReplies === each._id && (
                    <GetReplies
                      repliesData={state.commentsDataOfPost}
                      uniqueId={showReplies}
                    />
                  )}
                </>
              );
            })}
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {state.postData &&
                  currentPostData[0] &&
                  currentPostData[0].likes.includes(
                    userData.user && userData.user._id
                  ) ? (
                    <FavoriteIcon
                      onClick={() => addLike(id)}
                      style={{
                        marginBottom: "10px",
                        cursor: "pointer",
                        color: "red",
                      }}
                    />
                  ) : (
                    <FavoriteBorderOutlinedIcon
                      onClick={() => addLike(id)}
                      style={{
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  {likesCount > 0 && (
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        marginBottom: "0px",
                      }}
                    >
                      {likesCount} like
                    </p>
                  )}
                </div>
              </div>
              {bookMark.length > 0 ? (
                <BookmarkIcon
                  onClick={() => removeSavePost(id)}
                  style={{
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <BookmarkBorderOutlinedIcon
                  onClick={() => savePost(id)}
                  style={{
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
            <p
              style={{
                marginLeft: "18px",
                fontWeight: 600,
                marginTop: "0px",
                fontSize: "18px",
                marginBottom: "0px",
              }}
            ></p>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "0px",
              borderTop: "1px solid #c7c9c5",
              padding: "5px",
              alignItems: "center",
              paddingRight: "15px",
              color: "black",
            }}
          >
            {userData.user.profile_pic !== "" ? (
              <Avatar
                style={{ position: "inherit" }}
                src={`${BASE_URL}//${userData.user.profile_pic}`}
              />
            ) : (
              <Avatar className="m-0" style={{ position: "inherit" }} />
            )}
            <InputEmoji
              ref={inputRef}
              value={comment}
              onChange={setComment}
              cleanOnEnter
              onEnter={handleOnEnterComment}
              placeholder="Add your comment...."
              borderRadius={15}
              borderColor="white"
            />
            <p
              style={{
                color: "#0D99FF",
                fontSize: "20px",
                alignSelf: "flex-end",
                marginLeft: "80px",
                marginTop: "10px",
                fontWeight: 550,
              }}
              onClick={handleOnClickComment}
            >
              Post
            </p>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default PoatModal;
