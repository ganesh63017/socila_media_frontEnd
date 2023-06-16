import { Button, TextField } from "@mui/material";
import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MuiPhoneNumber from "material-ui-phone-number";

import { useSelector } from "react-redux";
import BASE_URL from "../service";

const EditPage = ({ getUserData, setEditPopup }) => {
  React.useEffect(() => {
    getUserData();
  }, []);

  const { userData } = useSelector((state) => state);
  const personDetails = userData.user;

  const [{ lastName, email, bio, date_of_birth, gender }, setInfo] =
    React.useState({
      lastName: "",
      email: "",
      bio: "",
      date_of_birth: "",
      gender: "",
    });

  const [mobile_number, setMobileNum] = React.useState("");
  const [openSnack, SetOpenSnack] = React.useState(false);
  const [successMsg, SetSuccessMsg] = React.useState("");
  const [ErrorMsg, SetErrorMsg] = React.useState("");

  const changeInput = (fieldName) => (event) => {
    setInfo((preState) => ({ ...preState, [fieldName]: event.target.value }));
  };

  const submitDetails = async () => {
    const obj = {
      lastName: lastName === "" ? personDetails.lastName : lastName,
      bio: bio === "" ? personDetails.bio : bio,
      gender: gender === "" ? personDetails.gender : gender,
      date_of_birth:
        date_of_birth === "" ? personDetails.date_of_birth : date_of_birth,
      mobile_number:
        mobile_number === "" ? personDetails.mobile_number : mobile_number,
      email: email === "" ? personDetails.email : email,
    };
    const url = `${BASE_URL}/users/${personDetails._id}`;
    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${userData.token}`,
      },
      body: JSON.stringify(obj),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      getUserData();
      SetOpenSnack(true);
      SetSuccessMsg(data.message);
      SetErrorMsg("");
      setTimeout(() => {
        setEditPopup();
        SetOpenSnack(false);
      }, 2000);
    } else {
      SetOpenSnack(true);
      setTimeout(() => {
        SetOpenSnack(false);
      }, 2000);
      SetSuccessMsg("");
      SetErrorMsg(data.message);
    }
  };

  return (
    <div>
      <TextField
        label="Name*"
        variant="outlined"
        className="login_email"
        fullWidth
        style={{
          marginBottom: "15px",
          marginTop: "15px  ",
        }}
        defaultValue={
          personDetails.lastName ? personDetails.lastName : lastName
        }
        onChange={changeInput("lastName")}
      />
      <TextField
        label="Email*"
        variant="outlined"
        className="login_email"
        fullWidth
        style={{
          marginBottom: "15px",
          marginTop: "15px  ",
        }}
        defaultValue={personDetails.email ? personDetails.email : email}
        onChange={changeInput("email")}
      />
      <TextareaAutosize
        style={{ width: "100%", padding: "20px" }}
        aria-label="empty textarea"
        placeholder="Enter your bio here....."
        minRows={4}
        defaultValue={personDetails.bio ? personDetails.bio : bio}
        onChange={changeInput("bio")}
      />
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue={personDetails.gender ? personDetails.gender : gender}
          onChange={changeInput("gender")}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontWeight: "500" }}>Date of birth</label>
        <input
          type="date"
          style={{ width: "300px", marginTop: "10px" }}
          defaultValue={
            personDetails.date_of_birth
              ? personDetails.date_of_birth
              : date_of_birth
          }
          onChange={changeInput("date_of_birth")}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          marginBottom: "50px",
        }}
      >
        <label htmlFor="phone" style={{ fontWeight: "500" }}>
          Enter contact number
        </label>
        <MuiPhoneNumber
          style={{
            width: "300px",
          }}
          onChange={(e) => setMobileNum(e)}
          defaultCountry={"in"}
          value={
            personDetails.mobile_number
              ? personDetails.mobile_number
              : mobile_number
          }
          fullWidth
        />
      </div>
      <Button variant="contained" fullWidth onClick={submitDetails}>
        Save profile
      </Button>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={ErrorMsg ? "error" : "success"} sx={{ width: "100%" }}>
          {ErrorMsg !== "" ? ErrorMsg : successMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditPage;
