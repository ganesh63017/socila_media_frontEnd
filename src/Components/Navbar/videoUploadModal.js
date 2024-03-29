import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ClearIcon from "@mui/icons-material/Clear";
import ReactPlayer from "react-player";
import { Alert, Button, Snackbar, Stack } from "@mui/material";

const VideoUploadModal = ({ url, close, videoModal, onUploadVideo }) => {
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

  const [open, setOpen] = useState(false);
  return (
    <>
      <Modal
        open={videoModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            minWidth: "1000px",
            minHeight: "700px",
            border: "none",
            borderRadius: "10px",
            boxShadow: "rgba(0.24, 0.24, 0.24, 0.24) 0px 3px 8px",
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            position: "relative",
          }}
        >
          <ReactPlayer
            loop={true}
            playing={true}
            width={1000}
            height={700}
            volume={1}
            muted={true}
            url={url}
          />

          <Button
            style={{
              position: "absolute",
              right: "80%",
              left: "8px",
              top: "700px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#0D99FF",
            }}
            component="label"
          >
            Change reel
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={onUploadVideo}
            />
          </Button>
          <ClearIcon
            style={{
              position: "absolute",
              left: "47%",
              top: "10px",
              zIndex: "0px",
              width: "100%",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={() => close()}
          />
          <p
            style={{
              position: "absolute",
              left: "90%",
              top: "700px",
              zIndex: "0px",
              width: "100%",
              fontSize: "24px",
              cursor: "pointer",
              color: "#0D99FF",
            }}
            onClick={() => {
              setOpen(true);
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }}
          >
            Next
          </p>
        </Box>
      </Modal>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={2000}>
          <Alert severity={"error"} sx={{ width: "100%" }}>
            Currently this feature is in Development mode
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
};

export default VideoUploadModal;
