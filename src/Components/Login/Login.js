import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { GoogleLogin } from "react-google-login";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import BASE_URL from "../service.js";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { encryptToken } from "../encryptionUtils.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openModalForgot, setOpenModalForgot] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgetEmail, setShowForgetEmail] = useState(true);
  const [forgotToken, setforgotToken] = useState("");
  const [openforgot, setOpenforgot] = useState(false);
  const [openUpdatePassword, setOpenUpdatePassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [{ email, password }, setInfo] = useState({
    password: "",
    email: "",
  });

  const [{ passwordError, emailError }, setError] = useState({
    passwordError: "",
    emailError: "",
  });

  const changeInput = (fieldName) => (event) => {
    setError((preState) => ({ ...preState, [`${fieldName}Error`]: "" }));
    setInfo((preState) => ({ ...preState, [fieldName]: event.target.value }));
  };

  const errorHandle = (fieldName) => {
    setError((preState) => ({ ...preState, [fieldName]: fieldName }));
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if ([email, password].includes("")) {
      if (email === "") {
        errorHandle("emailError");
      }
      if (password === "") {
        errorHandle("passwordError");
      }
    } else {
      const url = `${BASE_URL}/auth/login`;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        Cookies.set("token", encryptToken(data.token), {
          secure: true,
          sameSite: "strict",
          expires: 1,
        });
        dispatch({ type: "userData", payload: data });
        setOpen(true);
        setErrorMessage("");
        setTimeout(() => {
          setOpen(false);
          navigate("/feeds");
        }, 1500);
      } else {
        setOpen(true);
        setErrorMessage(data.message);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      }
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const googleLogin = async (googleData) => {
    const url = `${BASE_URL}/auth/googleLogin`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: googleData.tokenId }),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token, { expires: 1 });
      dispatch({ type: "userData", payload: data });
      setOpen(true);
      setErrorMessage("");
      setTimeout(() => {
        setOpen(false);
        navigate("/feeds");
      }, 1500);
    } else {
      setOpen(true);
      setErrorMessage(data.message);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  };

  const forgotPassword = async () => {
    const url = `${BASE_URL}/auth/forgot-password`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      setOpen(true);
      setErrorMessage(data.message);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } else {
      setShowForgetEmail(false);
      setforgotToken(data.token);
      setOpenforgot(true);
      setTimeout(() => {
        setOpenforgot(false);
      }, 3000);
    }
  };

  const resetPassword = async () => {
    const url = `${BASE_URL}/auth/reset-password?token=${forgotToken}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      setOpen(true);
      setErrorMessage("Some thing went Wrong");
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } else {
      setOpenUpdatePassword(true);
      setOpenModalForgot(false);
      setTimeout(() => {
        setOpenUpdatePassword(false);
      }, 2000);
    }
  };

  return (
    <div className="main_login">
      <div className="login_card">
        <h3 className="login_heading">Sign into Social Feed</h3>
        <div>
          <TextField
            error={emailError !== "" && "error"}
            label="Email id*"
            variant="outlined"
            className="login_email"
            style={{
              marginBottom: "15px",
            }}
            value={email}
            onChange={changeInput("email")}
          />
          {emailError !== "" && (
            <div
              style={{
                display: "flex",
                alignContent: "center",
                color: "red",
              }}
            >
              <ReportProblemIcon
                style={{
                  fontSize: "15px",
                  paddingLeft: "8px",
                }}
              />
              <p
                style={{
                  marginTop: "0px",
                  fontSize: "12px",
                  marginLeft: "5px",
                }}
              >
                Email Required
              </p>
            </div>
          )}
        </div>
        <div>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              style={{
                marginBottom: "15px",
                maxWidth: "100%",
              }}
              error={passwordError !== "" && "error"}
              className="login_email"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={changeInput("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((pre) => !pre)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        style={{ color: `${passwordError && "red"}` }}
                      />
                    ) : (
                      <Visibility
                        style={{ color: `${passwordError && "red"}` }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          {passwordError !== "" && (
            <div
              style={{
                display: "flex",
                alignContent: "center",
                color: "red",
              }}
            >
              <ReportProblemIcon
                style={{
                  fontSize: "15px",
                  paddingLeft: "8px",
                }}
              />
              <p
                style={{
                  marginTop: "0px",
                  fontSize: "12px",
                  marginLeft: "5px",
                }}
              >
                Password Required
              </p>
            </div>
          )}
        </div>
        <button
          style={{
            backgroundColor: "#1976D2",
            border: "none",
            height: "6vh",
            borderRadius: "6px",
            color: "white",
            width: "90%",
          }}
          onClick={handleLogin}
        >
          SIGN IN
        </button>
        <p
          style={{
            margin: "2px",
            alignSelf: "end",
            fontSize: "15px",
            cursor: "pointer",
            color: "#1976D2",
            marginRight: "42px",
          }}
          onClick={() => setOpenModalForgot(true)}
        >
          Forgot password?
        </p>

        <p>
          Don't have an account?{" "}
          <Link to="/register" style={{ textDecoration: "none" }}>
            <span
              style={{
                color: "#1976D2",
                weight: "800",
                cursor: "pointer",
                border: "none",
              }}
            >
              Sign Up
            </span>
          </Link>
        </p>
        <div
          style={{
            display: "flex",
            alignContent: "center",
          }}
        >
          <hr
            style={{
              width: "170px",
              height: "0px",
              backgroundColor: "#e8ecef",
              marginTop: "24px",
            }}
          />
          <p>OR</p>
          <hr
            style={{
              width: "170px",
              marginTop: "24px",
              height: "0px",
              backgroundColor: "#e8ecef",
            }}
          />
        </div>
        <div
          style={{
            width: "200px",
            alignSelf: "center",
          }}
        >
          <GoogleLogin
            clientId="106931131045-lbt1lo7ctfq3flp93m08vjuuvehrm47e.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={googleLogin}
            fullWidth
          />
        </div>
      </div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000}>
          <Alert
            severity={errorMessage === "" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errorMessage === "" ? "Successfully logged In" : errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={openforgot} autoHideDuration={6000}>
          <Alert
            severity={errorMessage === "" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errorMessage === ""
              ? "Email is Successfully Verified"
              : errorMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={openUpdatePassword} autoHideDuration={6000}>
          <Alert
            severity={errorMessage === "" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errorMessage === ""
              ? "Password is Successfully updated"
              : errorMessage}
          </Alert>
        </Snackbar>
        <Modal
          open={openModalForgot}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {showForgetEmail ? (
            <Box sx={style} style={{ width: "480px", height: "64vh" }}>
              <CancelIcon
                style={{
                  marginLeft: "70vh",
                  cursor: "pointer",
                }}
                onClick={() => setOpenModalForgot(false)}
              />
              <h1 id="modal-modal-title" variant="h6" component="h2">
                Forgot your password?
              </h1>
              <p
                style={{
                  color: "grey",
                }}
              >
                Please enter the email address associated with your account, and
                we'll email you a link to reset your password.
              </p>
              <TextField
                label="Email id*"
                variant="outlined"
                className="login_email"
                style={{
                  "margin-top": "15px",
                  marginBottom: "10px",
                }}
                value={email}
                onChange={changeInput("email")}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={forgotPassword}
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Reset Password
              </Button>
            </Box>
          ) : (
            <Box
              sx={style}
              style={{
                width: "500px",
              }}
            >
              <CancelIcon
                style={{
                  marginLeft: "50vh",
                  cursor: "pointer",
                }}
                onClick={() => setOpenModalForgot(false)}
              />
              <h1 id="modal-modal-title" variant="h6" component="h2">
                Please update your Password!
              </h1>
              <p
                style={{
                  color: "grey",
                }}
              >
                Email is verified, please enter the new password in below box to
                update your password.
              </p>
              <TextField
                label="Password*"
                variant="outlined"
                className="login_email"
                style={{
                  "margin-top": "15px",
                  marginBottom: "10px",
                }}
                value={password}
                onChange={changeInput("password")}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={resetPassword}
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Update Password
              </Button>
            </Box>
          )}
        </Modal>
      </Stack>
    </div>
  );
};

export default Login;
