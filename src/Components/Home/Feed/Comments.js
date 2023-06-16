import React, { useEffect, useRef, useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import InputEmoji from "react-input-emoji";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import { Avatar } from "@mui/material";
import SlideShow from "./SlideShow";
import ClearIcon from "@mui/icons-material/Clear";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import GetReplies from "./GetReplies";
import BASE_URL from "../../service.js";

const Comments = ({ id, getPostData, getAllComments, time }) => {
  useEffect(() => {
    getSavedPost();
  }, []);

  const [openSnack, SetOpenSnack] = React.useState(false);
  const [successMsg, SetSuccessMsg] = React.useState("");
  const [ErrorMsg, SetErrorMsg] = React.useState("");

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
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { savedPost } = state;

  const { userData, commentsData } = state;
  const currentPostData =
    state.postData && state.postData.filter((each) => each._id === id);
  const likesCount = currentPostData[0].likes.length;
  const [comment, setComment] = useState("");
  const [showReplies, setReplyId] = useState("");
  const [{ postId, commentId }, setReplyDetails] = useState({
    postId: "",
    commentId: "",
  });

  const [openCommentSection, setOpenCommentSection] = useState(false);

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

  const getSavedPost = async () => {
    const url = `${BASE_URL}/feeds/save`;
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

  const postComment = async (value) => {
    dispatch({ type: "loading", payload: true });
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
    const data = await response.json();
    if (response.ok) {
      setTimeout(() => {
        dispatch({ type: "loading", payload: false });
        setComment("");
        getPostData();
        getAllComments();
        getComment(id);
        SetOpenSnack(true);
        SetSuccessMsg(data.message);
        SetErrorMsg("");
      }, 300);

      setTimeout(() => {
        SetOpenSnack(false);
      }, 1500);
    } else {
      SetOpenSnack(true);
      SetSuccessMsg("");
      SetErrorMsg(data.message);
      setTimeout(() => {
        SetOpenSnack(false);
      }, 1500);
      setTimeout(() => {
        dispatch({ type: "loading", payload: false });
      }, 300);
    }
  };

  const handleOnEnterComment = async (text) => {
    dispatch({ type: "loading", payload: true });
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
        setTimeout(() => {
          setReplyDetails({ postId: "", commentId: "" });
          getComment();
          dispatch({ type: "loading", payload: false });
        }, 300);
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
        setTimeout(() => {
          setReplyDetails({ postId: "", commentId: "" });
          getComment();
          dispatch({ type: "loading", payload: false });
        }, 300);
      }
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
    if (response.ok) {
      getComment();
    }
  };

  const getComment = async (value) => {
    dispatch({ type: "loading", payload: true });
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
      setTimeout(() => {
        dispatch({ type: "loading", payload: false });
        dispatch({ type: "commentsDataOfPost", payload: data.data });
        setOpenCommentSection(true);
      }, 300);
    }
  };

  const savePost = async (id) => {
    dispatch({ type: "loading", payload: true });
    const url = `${BASE_URL}/feeds/save/${id}`;
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
      setTimeout(() => {
        getSavedPost();
        dispatch({ type: "loading", payload: false });
        SetOpenSnack(true);
        SetSuccessMsg(data.message);
        SetErrorMsg("");
      }, 300);
      setTimeout(() => {
        SetOpenSnack(false);
      }, 1500);
    } else {
      SetOpenSnack(true);
      SetSuccessMsg("");
      SetErrorMsg(data.message);
      setTimeout(() => {
        SetOpenSnack(false);
      }, 1500);
    }
  };

  const removeSavePost = async (id) => {
    dispatch({ type: "loading", payload: true });

    const url = `${BASE_URL}/feeds/save/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      setTimeout(() => {
        getSavedPost();
        SetOpenSnack(true);
        SetSuccessMsg(data.message);
        SetErrorMsg("");
        dispatch({ type: "loading", payload: false });
      }, 300);
      setTimeout(() => {
        SetOpenSnack(false);
      }, 1500);
    } else {
      SetOpenSnack(true);
      SetSuccessMsg("");
      SetErrorMsg(data.message);
      setTimeout(() => {
        SetOpenSnack(false);
      }, 1500);
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
    if (interval >= 1) {
      return interval + " min ago";
    }

    return Math.floor(seconds) + " sec ago";
  };

  let inputRef = useRef(null);

  const replyToComment = async (value) => {
    inputRef.current.focus();
    setReplyDetails({ postId: id, commentId: value });
  };

  const commentsCount =
    commentsData && commentsData.filter((each) => each.post_id === id);
  const bookMark =
    savedPost &&
    savedPost.filter((each) => each.savedPost._id === currentPostData[0]._id);

  return (
    <div key={id}>
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
                onClick={() => addLike()}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  color: "red",
                }}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
                onClick={() => addLike()}
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
          <ChatBubbleOutlineOutlinedIcon
            style={{
              marginBottom: "10px",
              cursor: "pointer",
            }}
            onClick={() => getComment()}
          />
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
      >
        {currentPostData[0].created_by.lastName}{" "}
        <span
          style={{
            fontWeight: 500,
            fontSize: "18px",
          }}
        >
          {currentPostData[0].caption}
        </span>
      </p>
      {commentsCount && commentsCount.length > 0 && (
        <p
          style={{
            marginLeft: "18px",
            fontWeight: 500,
            marginTop: "0px",
            color: "#838582",
            fontSize: "18px",
            marginBottom: "0px",
          }}
          onClick={() => getComment()}
        >
          View all {commentsCount.length} comments
        </p>
      )}
      <div>
        <p
          style={{
            marginLeft: "18px",
            fontWeight: 500,
            marginTop: "0px",
            color: "#5e6061",
            fontSize: "18px",
          }}
        >
          {time}
        </p>
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
        {userData?.user?.profile_pic !== "" ? (
          <Avatar
            style={{ position: "inherit" }}
            src={`${BASE_URL}/${userData?.user?.profile_pic}`}
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
      <Modal
        open={openCommentSection}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            width: "1130px",
            height: "624px",
            display: "flex",
            justifyContent: "space-evenly",
            padding: "0px",
            overflow: "auto",
          }}
        >
          <div>
            {currentPostData[0].posted_photos.length > 1 ? (
              <SlideShow
                slideImages={currentPostData[0].posted_photos}
                height={600}
                width={600}
              />
            ) : (
              <div>
                <img
                  src={`${BASE_URL}/${currentPostData[0].posted_photos[0]}`}
                  alt="pic"
                  width="600"
                  height="600"
                />
              </div>
            )}
          </div>
          <div
            style={{
              cursor: "pointer",
              justifyContent: "space-around",
              width: "500px",
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
                  marginTop: "60px",
                }}
              >
                {currentPostData[0] &&
                currentPostData[0]?.created_by?.profile_pic !== "" ? (
                  <Avatar
                    src={`${BASE_URL}/${currentPostData[0].created_by.profile_pic}`}
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
                      fontSize: "14px",
                      marginBottom: "0px",
                    }}
                  >
                    {currentPostData[0].created_by.lastName}
                    <p
                      style={{
                        color: "grey",
                        fontWeight: 500,
                      }}
                    >
                      {currentPostData[0].location}
                    </p>
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        visibility: 'hidden',
                      }}
                    >
                      {currentPostData[0].caption}
                    </p>
                  </p>
                </div>
              </div>
              <div>
                <ClearIcon
                  onClick={() => {
                    setReplyId("");
                    setOpenCommentSection(false);
                    dispatch({ type: "commentsDataOfPost", payload: [] });
                    setReplyDetails({ postId: "", commentId: "" });
                  }}
                  style={{
                    marginBottom: "5px",
                    marginLeft: "41px",
                    fontSize: "12px",
                  }}
                />
                <p style={{ color: "grey", fontSize: "14px" }}>{time}</p>
              </div>
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "20px",
                height: "350px",
                overflow: "scroll",
              }}
            >
              {state.commentsDataOfPost?.map((each) => {
                const date1 = new Date(each.createdAt);
                return (
                  <>
                    <div
                      key={each._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "420px",
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
                              src={`${BASE_URL}/${each.created_by.profile_pic}`}
                            />
                          ) : (
                            <Avatar />
                          )}
                          <p
                            style={{
                              marginLeft: "-37px",
                              marginTop: "5px",
                            }}
                          >
                            {each.created_by.lastName}
                          </p>
                          <p
                            style={{
                              color: "grey",
                              marginLeft: "-8px",
                              marginTop: "5px",
                            }}
                          >
                            {each.comment}
                          </p>
                        </div>
                        <div
                          className="d-flex"
                          style={{
                            marginTop: "-13px",
                          }}
                        >
                          <p style={{ color: "grey", marginLeft: "60px" }}>
                            {getTime(date1)}
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
            <div key={id}>
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
              {userData?.user?.profile_pic !== "" ? (
                <Avatar
                  style={{ position: "inherit" }}
                  src={`${BASE_URL}/${userData?.user?.profile_pic}`}
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
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={ErrorMsg ? "error" : "success"} sx={{ width: "100%" }}>
          {ErrorMsg !== "" ? ErrorMsg : successMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Comments;
