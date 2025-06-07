import React, { useEffect } from "react";
import YouTube from "react-youtube";

const VideoPlaying = ({ videoUrl }) => {
  if (!videoUrl || videoUrl === "영상 링크 첨부") return null;

  let videoKey;

  try {
    const url = new URL(videoUrl);

    if (url.hostname === "www.youtube.com") {
      videoKey = url.searchParams.get("v");
    } else if (url.hostname === "youtu.be") {
      videoKey = url.pathname.substring(1);
    }
  } catch (error) {
    alert("강의 URL에 문제가 생겼습니다. 강의자에게 강좌 주소를 확인해보세요.");
  }

  const opts = {
    height: 500,
    width: "100%",
    playerVars: {
      autoplay: 0, // 자동 재생 off
      rel: 0, // 관련 동영상 표시하지 않음
      modestbarnding: 1, // 컨트롤 바에 유튜브 로고를 표시하지 않음
    },
  };

  const onReady = (event) => {
    event.target.pauseVideo();
  };

  return <YouTube videoId={videoKey} opts={opts} onReady={onReady} />;
};

export default VideoPlaying;
