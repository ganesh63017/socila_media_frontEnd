import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SlideShow from "../Home/Feed/SlideShow";
import PoatModal from "../modal/PoatModal";
import BASE_URL from "../service.js";
const SavedPost = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const { userData, savedPost } = state;
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [ID, setId] = useState("");

  useEffect(() => {
    document.body.style.zoom = "57%";
    getSavedPost();
  }, []);

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

  const getData = async (id) => {
    setId(id);
    const url = `${BASE_URL}/feeds/comments/${id}`;
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
      document.body.style.zoom = "70%";

      setOpenCommentSection(true);
      dispatch({ type: "commentsDataOfPost", payload: data.data });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignItems: "stretch",
          width: "1000px",
          cursor: "pointer",
        }}
      >
        {savedPost?.map((each) => {
          if (each.savedPost.posted_photos.length !== 1) {
            return (
              <div
                key={each.post_id}
                onClick={(e) => {
                  e.stopPropagation();
                  getData(each.post_id);
                }}
              >
                <SlideShow
                  slideImages={each.savedPost.posted_photos}
                  height={300}
                  width={300}
                  navSize={30}
                />
              </div>
            );
          } else {
            return (
              <div
                key={each.post_id}
                onClick={(e) => {
                  getData(each.post_id);
                }}
              >
                <img
                  alt="pic"
                  src={`${BASE_URL}/${each.savedPost.posted_photos[0]}`}
                  style={{
                    height: "300px",
                    width: "300px",
                    margin: "5px",
                  }}
                />
              </div>
            );
          }
        })}
      </div>
      <PoatModal
        key={ID}
        id={ID}
        openCommentSection={openCommentSection}
        setOpenCommentSection={(value) => setOpenCommentSection(value)}
      />
    </div>
  );
};

export default SavedPost;
