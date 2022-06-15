import React, { useEffect, useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhotoOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import { Link, useNavigate } from "react-router-dom";
import UploadPostModal from "./UploadPostModal";
import VideoUploadModal from "./videoUploadModal";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import "./Navbar.css";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditPage from "../Edit/EditPage";
import HomeIcon from "@mui/icons-material/Home";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Navbar = () => {
  const dispatch = useDispatch();
  const { userData, clickedSave, clickedHome, videoUpload } = useSelector(
    (state) => state
  );

  const [openSnack, SetOpenSnack] = React.useState(false);
  const [successMsg, SetSuccessMsg] = React.useState("");
  const [ErrorMsg, SetErrorMsg] = React.useState("");
  const [videoUrl, SetVideoUrl] = React.useState("");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const url = `http://localhost:8080/users/${userData.user._id}`;

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
  const token = Cookies.get("token");
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

  const styleForLogo = {
    marginTop: "15px",
    fontSize: "30px",
    color: "#4f5152",
    cursor: "pointer",
  };
  const navigate = useNavigate();
  const [openModalPost, setOpenModalPost] = useState(false);
  const [openPasswordPopup, setPasswordPopup] = useState(false);
  const [openEditPopup, setEditPopup] = useState(false);
  const [{ newPassword, currentPassword, confirmPassword }, setInfo] = useState(
    {
      newPassword: "",
      currentPassword: "",
      confirmPassword: "",
    }
  );

  const [
    { newPasswordError, currentPasswordError, confirmPasswordError },
    setError,
  ] = useState({
    newPasswordError: "",
    currentPasswordError: "",
    confirmPasswordError: "",
  });

  const [openProfile, setOpenProfile] = useState(false);
  const [videoModal, setVideoModal] = useState(false);

  const changeInput = (fieldName) => (event) => {
    setError((preState) => ({ ...preState, [`${fieldName}Error`]: "" }));
    setInfo((preState) => ({ ...preState, [fieldName]: event.target.value }));
  };

  const errorHandle = (fieldName) => {
    setError((preState) => ({ ...preState, [fieldName]: fieldName }));
  };

  const handleModalPost = (value) => {
    setOpenModalPost(value);
  };

  const changePassword = async () => {
    if ([confirmPassword, newPassword, currentPassword].includes("")) {
      if (confirmPassword === "") {
        errorHandle("confirmPasswordError");
      }
      if (newPasswordError === "") {
        errorHandle("newPasswordError");
      }
      if (currentPassword === "") {
        errorHandle("currentPasswordError");
      }
    } else {
      const url = "http://localhost:8080/password";

      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          confirm_password: confirmPassword,
          old_password: currentPassword,
          new_password: newPassword,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        setInfo({ confirmPassword: "", newPassword: "", currentPassword: "" });
        SetOpenSnack(true);
        SetSuccessMsg(data.message);
        SetErrorMsg("");
        setTimeout(() => {
          SetOpenSnack(false);
        }, 1500);
        setPasswordPopup(false);
      } else {
        SetOpenSnack(true);
        SetSuccessMsg("");
        SetErrorMsg(data.message);
        setTimeout(() => {
          SetOpenSnack(false);
        }, 1500);
      }
    }
  };

  const addProfileImage = async (event) => {
    setOpenProfile((pre) => !pre);
    const formData = new FormData();
    formData.append("profile_pic", event.target.files[0]);
    if (window.confirm("Do u want to update the profile picture")) {
      const url = `http://localhost:8080/users/profile/${userData.user._id}`;
      const options = {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        getUserData();
        getPostData();
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
    }
  };

  const deleteProfileImage = async () => {
    setOpenProfile((pre) => !pre);
    if (window.confirm("Do u want to delete the profile picture")) {
      const url = `http://localhost:8080/users/profile/${userData.user._id}`;
      const options = {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        getUserData();
        getPostData();
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
    }
  };

  const getPostData = async () => {
    const url = `http://localhost:8080/feeds/posts`;
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
      dispatch({ type: "postData", payload: data });
    }
  };
  
const onUploadVideo = (e)=>{
  console.log(e.target.files[0])
  const url = URL.createObjectURL(e.target.files[0])
  SetVideoUrl(url)
  setVideoModal(true)
}

const closeVideoModal = ()=>{
  setVideoModal(false)
}
console.log(videoModal)
  return (
    <>
      <div
        className="w-100"
        style={{
          display: "flex",
          borderBottom: "1px solid #d0d6d0",
          justifyContent: "space-evenly",
          position: "fixed",
          backgroundColor: "white",
          width: "100%",
          margin: "0px",
          zIndex: "500",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#222222",
            alignItems: "center",
          }}
        >
          <img
            style={{
              height: "6vh",
            }}
            alt="logo"
            src="https://media-exp1.licdn.com/dms/image/C4E0BAQEt7xZrYWildg/company-logo_200_200/0/1626246420564?e=2147483647&v=beta&t=3PfNRzcNTiWjNTPWbZ7tW4Obc89NBpbhmJhXlqN53hM"
          />
          <p
            style={{
              fontWeight: "400",
              fontSize: "20px",
            }}
          >
            Life @{" "}
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              AM
            </span>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            width: "500px",
            borderBottom: "1px solid #d0d6d0",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {clickedHome ? (
            <HomeIcon
              style={styleForLogo}
              onClick={() => {
                window.scrollTo(5000, 0);
                dispatch({ type: "videoUpload", payload: false });
              }}
            />
          ) : (
            <HomeOutlinedIcon
              style={styleForLogo}
              onClick={() => {
                dispatch({ type: "clickedSave", payload: false });
                dispatch({ type: "clickedHome", payload: true });
                dispatch({ type: "videoUpload", payload: false });
                navigate("/feeds");
                window.scrollTo(500, 0);
              }}
            />
          )}

          <AddAPhotoIcon
            style={styleForLogo}
            onClick={() => {
              handleModalPost(true);
              dispatch({ type: "videoUpload", payload: false });
            }}
          />
          <Link to="/videoReels">
            <VideoLibraryIcon
              style={styleForLogo}
              onClick={() => {
                dispatch({ type: "clickedHome", payload: false });
                dispatch({ type: "clickedSave", payload: false });
                dispatch({ type: "videoUpload", payload: true });
              }}
            />
          </Link>
          <Link to="/savedFeeds">
            {clickedSave ? (
              <BookmarkIcon style={styleForLogo} />
            ) : (
              <BookmarkBorderOutlinedIcon
                style={styleForLogo}
                onClick={() => {
                  dispatch({ type: "clickedHome", payload: false });
                  dispatch({ type: "clickedSave", payload: true });
                  dispatch({ type: "videoUpload", payload: false });
                }}
              />
            )}
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignContent: "center",
              width: "140px",
            }}
          >
            <Popup
              trigger={
                userData && userData?.user?.profile_pic === "" ? (
                  <Avatar
                    style={{
                      height: "4vh",
                      marginTop: "12px",
                      cursor: "pointer",
                    }}
                  ></Avatar>
                ) : (
                  <Avatar
                    style={{
                      height: "4vh",
                      marginTop: "12px",
                      cursor: "pointer",
                    }}
                    src={`http://localhost:8080/${userData?.user?.profile_pic}`}
                  />
                )
              }
              position="bottom left"
            >
              <div
                className="card border-top-0 rounded shadow-lg"
                style={{
                  width: "250px",
                  cursor: "pointer",
                }}
              >
                <div
                  className="d-flex  profileTags p-2 h"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch({ type: "loading", payload: true });
                    setTimeout(() => {
                      dispatch({ type: "loading", payload: false });
                      setEditPopup(true);
                    }, 300);
                  }}
                >
                  <EditRoundedIcon style={{ margin: "10px" }} />
                  <label
                    className="text-dark"
                    style={{ margin: "10px", cursor: "pointer" }}
                  >
                    Edit profile
                  </label>
                </div>
                <div
                  className="d-flex profileTags p-2 h"
                  style={{
                    borderBottom: "1px solid #d0d6ce",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch({ type: "loading", payload: true });
                    setTimeout(() => {
                      dispatch({ type: "loading", payload: false });
                      setPasswordPopup(true);
                    }, 300);
                  }}
                >
                  <ManageAccountsRoundedIcon
                    style={{ margin: "10px", cursor: "pointer" }}
                  />
                  <label
                    className="text-dark"
                    style={{ margin: "10px", cursor: "pointer" }}
                  >
                    Change password
                  </label>
                </div>
                <div
                  className="d-flex  profileTags p-2 h"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch({ type: "loading", payload: true });

                    setTimeout(() => {
                      Cookies.remove("token");
                      localStorage.clear();
                      navigate("/");
                      dispatch({ type: "loading", payload: false });
                    }, 800);
                  }}
                >
                  <LogoutRoundedIcon style={{ margin: "10px" }} />
                  <label
                    className="text-dark"
                    style={{ margin: "10px", cursor: "pointer" }}
                  >
                    Logout
                  </label>
                </div>
              </div>
            </Popup>

            <p
              style={{
                marginTop: "20px",
                marginLeft: "8px",
                cursor: "pointer",
                fontWeight: "550",
                fontFamily: "initial",
                fontSize: "18px",
              }}
            >
              {userData && userData.user?.lastName}
            </p>
          </div>
          {videoUpload && (
            <Button component="label">
              <CloudUploadIcon style={styleForLogo} />
              <input type="file" hidden accept="video/*" onChange={onUploadVideo}/>
            </Button>
          )} 
        </div>
      </div>
      <Modal
        open={openPasswordPopup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            padding: "20px",
            minWidth: "700px",
            minHeight: "350px",
            border: "none",
            borderRadius: "10px",
            boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <h4
              style={{
                justifyContent: "center",
                marginLeft: "20vh",
                fontWeight: 700,
              }}
            >
              Reset your password
            </h4>
            <ClearRoundedIcon
              style={{
                justifyContent: "center",
                marginLeft: "20vh",
                cursor: "pointer",
              }}
              onClick={() => {
                setPasswordPopup(false);
              }}
            />
          </div>
          <TextField
            error={currentPasswordError !== "" && "error"}
            label="Current password*"
            variant="outlined"
            className="login_email"
            style={{
              "margin-top": "15px",
              marginBottom: "10px",
            }}
            fullWidth
            value={currentPassword}
            onChange={changeInput("currentPassword")}
          />
          <TextField
            error={newPasswordError !== "" && "error"}
            label="New password*"
            variant="outlined"
            className="login_email"
            style={{
              "margin-top": "15px",
              marginBottom: "10px",
            }}
            fullWidth
            value={newPassword}
            onChange={changeInput("newPassword")}
          />
          <TextField
            error={confirmPasswordError !== "" && "error"}
            label="Confirm password*"
            variant="outlined"
            className="login_email"
            style={{
              "margin-top": "15px",
              marginBottom: "10px",
            }}
            fullWidth
            value={confirmPassword}
            onChange={changeInput("confirmPassword")}
          />
          <Button
            fullWidth
            style={{
              backgroundColor: "#0D99FF",
              fontWeight: 600,
              color: "white",
              padding: "10px",
            }}
            onClick={changePassword}
          >
            Reset password
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openEditPopup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            padding: "20px",
            minWidth: "600px",
            minHeight: "900px",
            border: "none",
            borderRadius: "10px",
            boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <h4
              style={{
                justifyContent: "center",
                marginLeft: "22vh",
                fontWeight: 700,
                marginTop: "30px",
              }}
            >
              Profile Update
            </h4>
            <ClearRoundedIcon
              style={{
                justifyContent: "center",
                marginLeft: "18vh",
                cursor: "pointer",
              }}
              onClick={() => {
                setEditPopup(false);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              cursor: "pointer",
            }}
          >
            {userData && userData.user?.profile_pic === "" ? (
              <Avatar
                style={{
                  alignSelf: "center",
                  marginTop: "30px",
                  fontSize: "100px",
                  height: "8vh",
                  width: "75px",
                  position: "relative",
                }}
              ></Avatar>
            ) : (
              <Avatar
                style={{
                  height: "8vh",
                  width: "75px",
                  marginTop: "30px",
                  cursor: "pointer",
                }}
                src={`http://localhost:8080/${userData?.user?.profile_pic}`}
              />
            )}
            <Button
              component="label"
              className="image"
              style={{
                marginLeft: "0px",
                position: "absolute",
                padding: "10px",
              }}
              onClick={() => setOpenProfile((pre) => !pre)}
            >
              <AddAPhotoIcon
                style={{
                  width: "34px",
                  height: "30px",
                  position: "absolute",
                  marginLeft: "65px",
                  marginTop: "170px",
                  backgroundColor: "white",
                  borderRadius: "40px",
                  fontSize: "26px",
                  border: "1px solid #dfe2e8",
                }}
                variant="contained"
              />
            </Button>
            {openProfile && (
              <div
                className="card border-top-0 rounded shadow-lg"
                style={{
                  width: "250px",
                  cursor: "pointer",
                  position: "absolute",
                  marginTop: "12vh",
                  marginLeft: "22vh",
                  zIndex: "500",
                }}
              >
                <Button
                  component="label"
                  className="d-flex  profileTags p-2 h"
                  style={{ cursor: "pointer", color: "black" }}
                >
                  <AddAPhotoIcon style={{ margin: "10px" }} />
                  <label
                    className="text-dark"
                    style={{
                      margin: "10px",
                      cursor: "pointer",
                      marginRight: "70px",
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      style={{ position: "absolute" }}
                      onChange={addProfileImage}
                    />
                    Upload photo
                  </label>
                </Button>
                <div
                  className="d-flex profileTags p-2 h"
                  style={{
                    borderBottom: "1px solid #d0d6ce",
                    cursor: "pointer",
                  }}
                  onClick={deleteProfileImage}
                >
                  <DeleteOutlinedIcon
                    style={{ margin: "10px", cursor: "pointer" }}
                  />
                  <label
                    className="text-dark"
                    style={{ margin: "10px", cursor: "pointer" }}
                  >
                    Remove photo
                  </label>
                </div>
                <div
                  className="d-flex  profileTags p-2 h"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenProfile((pre) => !pre);
                  }}
                >
                  <ClearRoundedIcon style={{ margin: "10px" }} />
                  <label
                    className="text-dark"
                    style={{ margin: "10px", cursor: "pointer" }}
                  >
                    Cancel
                  </label>
                </div>
              </div>
            )}
          </div>
          <EditPage
            getUserData={getUserData}
            setEditPopup={() => setEditPopup((pre) => !pre)}
          />
        </Box>
      </Modal>
      <UploadPostModal
        openModalPost={openModalPost}
        handleModalPost={handleModalPost}
      />
      <VideoUploadModal url={videoUrl} videoModal={videoModal} close={closeVideoModal} onUploadVideo={onUploadVideo}/>
      
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={ErrorMsg ? "error" : "success"} sx={{ width: "100%" }}>
          {ErrorMsg !== "" ? ErrorMsg : successMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
