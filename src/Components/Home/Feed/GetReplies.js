import { Avatar } from "@mui/material";
import React from "react";
import "./index.css";
import BASE_URL from "../../service.js";

const GetReplies = ({ repliesData, uniqueId }) => {
  const replies = repliesData.filter((each) => each._id === uniqueId);

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

  return (
    <div
      style={{
        height: "150px",
        overflow: "scroll",
        backgroundColor: "#f8faf2",
        padding: "20px",
        width: "427px",
        marginTop: "14px",
        marginBottom: "16px",
      }}
    >
      {replies[0] &&
        replies[0]?.comments?.map((each) => {
          const date1 = new Date(each.time);
          return (
            <div key={each.time} className="back" style={{ marginTop: "-5px" }}>
              <div
                style={{
                  width: "203px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {each?.userDetails?.profile_pic !== "" ? (
                  <Avatar src={`${BASE_URL}/${each.userDetails.profile_pic}`} />
                ) : (
                  <Avatar />
                )}
                <p>{each.userDetails.firstName}</p>
                <p style={{ color: "grey", marginLeft: "20px" }}>
                  {each.comment}
                </p>
              </div>
              <div className="d-flex">
                <p
                  style={{
                    color: "grey",
                    marginLeft: "9vh",
                    marginTop: "-18px",
                  }}
                >
                  {getTime(date1)}
                </p>
              </div>
              <div>
                {each.comments?.map((each) => (
                  <p>{each.comment}</p>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GetReplies;
