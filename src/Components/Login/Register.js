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
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import "./login.css";
import { Link } from "react-router-dom";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [openverifySuccessfull, setOpenverifySuccessfull] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");
  console.log(token);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [{ firstName, lastName, password, email, verifyEmail }, setInfo] =
    useState({
      firstName: "",
      password: "",
      lastName: "",
      email: "",
      verifyEmail: "",
    });

  const [
    { firstNameError, lastNameError, passwordError, emailError },
    setError,
  ] = useState({
    firstNameError: "",
    lastNameError: "",
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

  const registerDetails = async (e) => {
    e.preventDefault();
    if ([firstName, lastName, password, email].includes("")) {
      if (firstName === "") {
        errorHandle("firstNameError");
      }
      if (lastName === "") {
        errorHandle("lastNameError");
      }
      if (email === "") {
        errorHandle("emailError");
      }
      if (password === "") {
        errorHandle("passwordError");
      }
    } else {
      const url = "http://localhost:8080/auth/register";
      const userDetails = {
        lastName,
        firstName,
        email,
        password,
        bio: "",
        date_of_birth: "",
        gender: "",
        mobile_number: "",
        profile_pic: "",
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      };
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.status === 400) {
        setOpen(true);
        setErrorMessage(data.message);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      } else {
        setToken(data.token);
        setOpen(true);
        setErrorMessage("");
        setTimeout(() => {
          setOpenModal(true);
        }, 1000);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
      }
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const style = {
    minHeight: "5vh",
    width: "100px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 50,
    p: 4,
    borderRadius: "8px",
  };

  const sendVerification = async () => {
    const url = "http://localhost:8080/auth/send-verification-email";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: email }),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      setVerificationMessage("ok");
      setVerifyToken(data.token);
    }
  };

  const verifyTokenLink = async () => {
    const url = `http://localhost:8080/auth/verify-email?token=${verifyToken}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      setOpenverifySuccessfull(true);
    }
  };

  return (
    <div className="main_login">
      <div className="login_card">
        <h3 className="login_heading">Sign up to Social Feed</h3>
        <div
          style={{
            display: "flex",
            marginBottom: "10px",
          }}
        >
          <div>
            <TextField
              error={firstNameError !== "" && "error"}
              label="First Name*"
              variant="outlined"
              style={{
                "margin-bottom": "20px",
                margin: "5px",
              }}
              value={firstName}
              onChange={changeInput("firstName")}
            />
            {firstNameError !== "" && (
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
                  FirstName Required
                </p>
              </div>
            )}
          </div>
          <div>
            <TextField
              error={lastNameError !== "" && "error"}
              label="Last Name*"
              variant="outlined"
              style={{
                "margin-bottom": "20px",
                margin: "5px",
              }}
              value={lastName}
              onChange={changeInput("lastName")}
            />
            {lastNameError !== "" && (
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
                  lastName Required
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <TextField
            error={emailError !== "" && "error"}
            label="Email id*"
            variant="outlined"
            className="login_email"
            style={{
              "margin-bottom": "15px",
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
                "margin-bottom": "15px",
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
        <Button
          variant="contained"
          style={{
            "margin-bottom": "10px",
          }}
          onClick={registerDetails}
        >
          SIGN UP
        </Button>

        <p>
          Already having an account?
          <Link to="/login" style={{ textDecoration: "none" }}>
            <span
              style={{
                color: "#1976D2",
                weight: "800",
                cursor: "pointer",
                border: "none",
              }}
            >
              Sign in
            </span>
          </Link>
        </p>
      </div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={errorMessage === "" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {errorMessage === ""
              ? "Successfully Registered Please Verify Your Email"
              : errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openverifySuccessfull}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {errorMessage === ""
              ? "Successfully Verified Your Email"
              : errorMessage}
          </Alert>
        </Snackbar>
      </Stack>
      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ minWidth: "500px" }}>
          {openverifySuccessfull ? (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenModal(false)}
              >
                Please Login
              </Button>
            </Link>
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Verify Email
              </Typography>

              <TextField
                label="Email id*"
                variant="outlined"
                className="login_email"
                style={{
                  "margin-top": "15px",
                  marginBottom: "15px",
                }}
                disabled={email !== "" ? "disabled" : ""}
                value={email !== "" ? email : verifyEmail}
                onChange={changeInput("verifyEmail")}
              />

              {verificationMessage !== "" ? (
                <>
                  <TextField
                    id="outlined-multiline-static"
                    label="Token"
                    multiline
                    rows={3}
                    defaultValue={verifyToken}
                    disabled
                  />
                  <Button
                    variant="contained"
                    href="#contained-buttons"
                    style={{
                      margin: "20px",
                    }}
                    onClick={verifyTokenLink}
                  >
                    Verify Token
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  style={{
                    margin: "20px",
                  }}
                  onClick={sendVerification}
                >
                  Send verification
                </Button>
              )}

              {verificationMessage !== "" && (
                <p
                  style={{
                    color: "green",
                    fontSize: "15px",
                  }}
                >
                  * Verification Link send to <span>{email}</span>
                </p>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Register;
