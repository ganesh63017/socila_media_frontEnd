import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import BASE_URL from '../../service.js'

const SlideShow = ({ slideImages, height, width, navSize }) => {
  const dataConversion = slideImages.map((each, i) => {
    return { url: `${BASE_URL}/${each}` };
  });
  return (
    <div style={{ position: "relative", margin: "5px" }}>
      <SimpleImageSlider
        height={height ? height : 600}
        width={width ? width : 600}
        images={dataConversion}
        showBullets={true}
        showNavs={true}
        navSize={navSize ? navSize : 60}
        startIndex={1}
        navStyle={2}
      />
    </div>
  );
};
export default SlideShow;
