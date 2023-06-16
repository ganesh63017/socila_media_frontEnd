import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import SlideShowPreview from "./SlideShowPreview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { Avatar, TextField } from "@mui/material";
import Cookies from "js-cookie";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import Maps from "../GoogleMaps/Maps";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import GoogleMaps from "../GoogleMaps/Maps";
import BASE_URL from "../service.js";

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

export default function UploadPostModal({ openModalPost, handleModalPost }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const [openSnack, SetOpenSnack] = React.useState(false);
  const [successMsg, SetSuccessMsg] = React.useState("");
  const [ErrorMsg, SetErrorMsg] = React.useState("");
  const { userData } = state;
  const [photos, setPhotos] = React.useState([]);
  const [previewPhotos, setPreviewPhotos] = React.useState([]);
  const [showDiscard, setShowDiscard] = React.useState(false);
  const [goToComment, setGoToCommentBox] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const [imagesError, setImagesError] = React.useState("");
  const [showLocations, setShowLocations] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const getLocation = (value) => {
    setLocation(value);
  };
  const addImage = async (event) => {
    let images = [];

    for (let i = 0; i < event.target.files.length; i++) {
      images.push({
        id: v4(),
        url: URL.createObjectURL(event.target.files[i]),
        name: event.target.files[i].name,
      });
    }

    if (previewPhotos.length + images.length <= 5) {
      setPreviewPhotos((pre) => [...pre, ...images]);
      setPhotos((pre) => [...pre, ...event.target.files]);
    } else {
      setImagesError("Cant upload more than 5 Photos");
      setTimeout(() => {
        setImagesError("");
      }, 3000);
    }
  };

  const uploadPhotos = async () => {
    let formData = new FormData();

    for (let i = 0; i < photos.length; i++) {
      formData.append("posted_photos", photos[i]);
    }

    formData.append("caption", caption);
    formData.append("likes", []);
    formData.append("location", location);
    const url = `${BASE_URL}/feeds/posts`;

    const options = {
      method: "POST",
      headers: {
        authorization: `Bearer ${userData.token}`,
      },
      body: formData,
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: "loading", action: true });
      setGoToCommentBox(false);
      setPreviewPhotos([]);
      setPhotos([]);
      setCaption("");
      handleModalPost(false);
      getPostData();
      setLocation("");
      setShowLocations((pre) => !pre);
      SetOpenSnack(true);
      SetSuccessMsg(data.message);
      SetErrorMsg("");
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

  const getPostData = async () => {
    dispatch({ type: "loading", action: true });
    const url = `${BASE_URL}/feeds/posts`;
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
        dispatch({ type: "loading", action: false });
        dispatch({ type: "postData", payload: data });
      }, 300);
    }
  };

  const discardTheCard = (value) => {
    setShowDiscard(value);
  };

  const goToCaptionBox = () => {
    if (previewPhotos.length >= 1) {
      setGoToCommentBox(true);
    }
  };

  const deletePhoto = (value) => {
    const filteredPreview = previewPhotos.filter((each) => each.name !== value);
    const filteredPhotos = photos.filter((each) => each.name !== value);
    setPreviewPhotos(filteredPreview);
    setPhotos(filteredPhotos);
    if (filteredPreview.length === 0) {
      setGoToCommentBox(false);
      setPhotos([]);
    }
  };

  return (
    <div>
      {goToComment ? (
        <Modal
          open={openModalPost}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={style}
            style={{
              width: "1000px",
              maxHeight: "550px",
              overflowX: "hidden",
              border: "none",
              borderRadius: "10px",
              boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              position: "relative",
            }}
          >
            <ClearIcon
              onClick={() => {
                setGoToCommentBox(false);
                setPreviewPhotos([]);
                setPhotos([]);
                setCaption("");
                handleModalPost(false);
                setLocation("");
                setShowLocations((pre) => !pre);
              }}
              style={{
                position: "absolute",
                left: "48%",
                top: "10px",
                zIndex: "0px",
                width: "100%",
                fontSize: "20px",
                cursor: "pointer",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              {previewPhotos.length > 1 ? (
                <SlideShowPreview slideImages={previewPhotos} size={true} />
              ) : (
                <img
                  style={{
                    width: "410px",
                    height: "500px",
                    marginBottom: "0px",
                  }}
                  alt="pic"
                  src={previewPhotos[0].url}
                />
              )}
              <div
                style={{
                  borderTop: "1px solid #bfbeba",
                  width: "570px",
                }}
              >
                <div style={{ margin: "20px", display: "flex" }}>
                  {userData && userData.user.profile_pic === "" ? (
                    <Avatar></Avatar>
                  ) : (
                    <Avatar
                      style={{ position: "inherit" }}
                      src={`${BASE_URL}/${userData.user.profile_pic}`}
                    />
                  )}
                  <p
                    style={{
                      marginLeft: "20px",
                      fontSize: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {userData && userData.user.firstName}
                  </p>
                </div>
                <div
                  style={{
                    margin: "20px",
                    display: "flex",
                    marginBottom: "15vh",
                  }}
                >
                  <InsertEmoticonIcon style={{ fontSize: "30px" }} />
                  <input
                    type="text"
                    style={{
                      marginLeft: "20px",
                      outline: "none",
                      border: "none",
                    }}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption........"
                  />
                  <p
                    style={{
                      alignSelf: "flex-end",
                      marginLeft: "200px",
                      color: "#0D99FF",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => uploadPhotos()}
                  >
                    Upload
                  </p>
                </div>
                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      display: "flex",
                      padding: "20px",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Add location..........</p>

                    {/* <TextField
                      id="standard-basic"
                      variant="standard"
                      onChange={(e) => getSearchedLocation(e.target.value)}
                      value={`${location}`}
                    /> */}

                    <Button component="label">
                      <LocationOnOutlinedIcon
                        onClick={() => setShowLocations((pre) => !pre)}
                      />
                    </Button>
                  </div>
                  {showLocations && (
                    <div
                      style={{
                        padding: "20px",
                        height: "200px",
                        border: "1px solid #a5abb5",
                        position: "relative",
                        zIndex: 5,
                      }}
                    >
                      <GoogleMaps getLocation={getLocation} />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    padding: "20px",
                    justifyContent: "space-between",
                    alignSelf: "flex-end",
                  }}
                >
                  {previewPhotos.length < 5 && <p>Add images..........</p>}
                  {/* <ArrowCircleLeftIcon /> */}

                  {previewPhotos?.map((each) => {
                    return (
                      <div
                        key={each.id}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          alt="preview"
                          src={each.url}
                          style={{
                            height: "6vh",
                            width: "80px",
                            margin: "5px",
                            opacity: "90%",
                          }}
                        />

                        <div
                          style={{
                            position: "absolute",
                            left: "70px",
                            top: "8px",
                            "z-index": "10px",
                            height: "16px",
                            borderRadius: "500px",
                            backgroundColor: "#81827e",
                          }}
                        >
                          <ClearIcon
                            onClick={() => deletePhoto(each.name)}
                            style={{
                              fontSize: "15px",
                              color: "white",
                              marginBottom: "20px",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {previewPhotos.length < 5 && (
                    <Button component="label">
                      <AddAPhotoOutlinedIcon />
                      <input type="file" hidden multiple onChange={addImage} />
                    </Button>
                  )}
                  {/* <ArrowCircleRightIcon /> */}
                </div>
                {imagesError !== "" && (
                  <p style={{ color: "red", marginLeft: "30px" }}>
                    {imagesError} *
                  </p>
                )}
              </div>
            </div>
          </Box>
        </Modal>
      ) : (
        <Modal
          open={openModalPost}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {showDiscard ? (
            <Box
              sx={style}
              style={{
                minWidth: "680px",
                minHeight: "550px",
                border: "none",
                boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <img
                style={{
                  height: "25vh",
                  marginBottom: "40px",
                  alignSelf: "center",
                }}
                alt="pic"
                src="https://res.cloudinary.com/duivdefdy/image/upload/v1653040600/ho/question-mark_1_lczpuy.png"
              />
              <p
                style={{
                  color: "grey",
                  fontWeight: "600",
                  alignSelf: "center",
                }}
              >
                Do you really want to discard uploading
              </p>
              <button
                style={{
                  width: "200px",
                  alignSelf: "center",
                  marginTop: "4vh",
                  fontWeight: 600,
                  backgroundColor: "#0D99FF",
                  border: "none",
                  color: "white   ",
                  padding: "14px",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  discardTheCard(false);
                  setPreviewPhotos([]);
                  setPhotos([]);
                }}
              >
                Discard process
              </button>
              <button
                style={{
                  width: "200px",
                  alignSelf: "center",
                  marginTop: "2vh",
                  fontWeight: 600,
                  color: "#0D99FF",
                  background: "none",
                  border: "none",
                }}
                onClick={() => {
                  discardTheCard(false);
                }}
              >
                Cancel
              </button>
            </Box>
          ) : (
            <Box
              sx={style}
              style={{
                minWidth: "680px",
                height: "550px",
                border: "none",
                boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {previewPhotos.length > 0 ? (
                previewPhotos.length === 1 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ArrowBackIcon
                        onClick={() => discardTheCard(true)}
                        style={{
                          cursor: "pointer",
                          marginBottom: "20px",
                        }}
                      />
                      <p
                        style={{
                          color: "#0D99FF",
                          fontSize: "18px",
                          fontWeight: "580",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          goToCaptionBox();
                        }}
                      >
                        Next
                      </p>
                    </div>
                    <img
                      alt="pic"
                      src={previewPhotos[0].url}
                      style={{ height: "400px", objectFit: "contain" }}
                    />
                    <input
                      type="file"
                      multiple
                      onChange={addImage}
                      style={{
                        position: "absolute",
                        top: "29%",
                        left: "10%",
                        opacity: 0,
                        padding: "8rem",
                        height: "6rem",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ArrowBackIcon
                        onClick={() => discardTheCard(true)}
                        style={{
                          cursor: "pointer",
                          marginBottom: "20px",
                        }}
                      />
                      <p
                        style={{
                          color: "#0D99FF",
                          fontSize: "18px",
                          fontWeight: "580",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          goToCaptionBox();
                        }}
                      >
                        Next
                      </p>
                    </div>
                    <SlideShowPreview slideImages={previewPhotos} />
                    <input
                      type="file"
                      multiple
                      onChange={addImage}
                      style={{
                        position: "absolute",
                        top: "35%",
                        left: "23%",
                        opacity: 0,
                        padding: "2rem",
                        backgroundColor: "black",
                        height: "10rem",
                      }}
                    />
                  </>
                )
              ) : (
                <>
                  <CancelIcon
                    style={{
                      alignSelf: "flex-end",
                      cursor: "pointer",
                      marginBottom: "20px",
                    }}
                    onClick={() => {
                      handleModalPost(false);
                    }}
                  />
                  <img
                    style={{
                      height: "25vh",
                      margin: "80px",
                      alignSelf: "center",
                    }}
                    alt="logo"
                    src="https://res.cloudinary.com/duivdefdy/image/upload/v1653028022/ho/Frame_14_dyyhhs.svg"
                  />
                  <input
                    type="file"
                    multiple
                    onChange={addImage}
                    style={{
                      position: "absolute",
                      top: "29%",
                      left: "10%",
                      opacity: 0,
                      padding: "8rem",
                      height: "6rem",
                    }}
                  />
                </>
              )}
              <Button
                component="label"
                className="image"
                variant="contained"
                style={{
                  width: "300px",
                  alignSelf: "center",
                  marginTop: "4vh",
                }}
              >
                <input type="file" hidden multiple onChange={addImage} />
                {previewPhotos.length > 0
                  ? "Add more photos"
                  : "Upload from computer"}
              </Button>
              {imagesError !== "" && (
                <p style={{ color: "red", marginTop: "30px" }}>
                  {imagesError} *
                </p>
              )}
            </Box>
          )}
        </Modal>
      )}
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
}
