import React from 'react';
import HLSPlayer from '../HLSPlayer/HLSPlayer';

class VideoEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <h1>
        Video me up
    </h1>
      <HLSPlayer
        url={"https://prospelling.s3-us-west-2.amazonaws.com/video/Test4/playlist.m3u8"}
      />
    </div>)
  }

}

export default VideoEdit