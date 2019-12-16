import React, { useState, useEffect } from 'react';
import HLS from '../HLSPlayer/HLSPlayer';
import m3u8 from "./m3u8"
//SOME TEST CONTENT
// https://prospelling.s3-us-west-2.amazonaws.com/video/Test4/playlist.m3u8
// https://player.vimeo.com/external/337448540.m3u8?s=317f54e1622ff7a47377701d0ad87fd5a5bd1175&oauth2_token_id=1121238946

const VideoEdit = () => {

  const [urlString, setUrlString] = useState("")
  const [url, setUrl] = useState("")
  const [video, setVideo] = useState({})
  const [isManifestLoading, setIsManifestLoading] = useState(false)
  const [isManifestLoaded, setIsManifestLoaded] = useState(false)
  const [segments, setSegments] = useState([])
  const [selectedSegments, setSelectedSegments] = useState([])


  useEffect(() => {
    console.log("Index.js line 20")

    if (!isManifestLoaded && !isManifestLoading && video && video.video) {
      this.setState({
        isManifestLoading: true,
      }, () => {
        const manifestInfo = m3u8.getManifestFileInfo(url);

        if (!manifestInfo) {
          return;
        }

        m3u8
          .getVideoManifest(manifestInfo.contentUrl)
          .then((manifest) => {
            const segments = m3u8.getManifestSegments(manifestInfo, manifest);

            console.log("Index.js line 37")
            console.log(`Developer info: ${segments.length} segment size.`);

            setIsManifestLoaded(true)
            setIsManifestLoading(false)
            setSegments(segments)
            setSelectedSegments([])
          });
      });
    }
  })

  let playerRef = React.createRef();

  const handleClickBtnAddBestBit = () => {
    const { videoRef } = playerRef.current;
    const { currentTime } = videoRef;

    const closestSegment = m3u8.getClosestSegmentByTime(segments, currentTime);
    closestSegment.label = selectedSegments.length + 1;

    let s = selectedSegments
    s.push(closestSegment);
    setSelectedSegments(s)

    setSelectedSegments({ selectedSegments });
  }


  return (
    <div>

      <HLS
        ref={playerRef}
        url={url}
        autoplay={true}
        hlsConfig={{ enableWorker: false }}
      />
      <input id="url" 
      onChange={e => setUrlString(e.target.value)} 
      style={{ width: '500px' }} 
      // value = "https://player.vimeo.com/external/337448540.m3u8?s=317f54e1622ff7a47377701d0ad87fd5a5bd1175&oauth2_token_id=1121238946"/>
      // value = "https://prospelling.s3-us-west-2.amazonaws.com/video/Test4/playlist.m3u8"/>
      />
      <button onClick={e => setUrl(urlString)}>Load Video</button>
      <button onClick={e => { handleClickBtnAddBestBit() }}>Add Best Bit</button>

      {selectedSegments.map((item, index) => {
        console.log(item)
      })}
    </div>
  )

}

export default VideoEdit



// // import m3u8 from './m3u8';

// // class VideoEdit extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.playerRef = React.createRef();
// //     this.state = {
// //       url: ""
// //     }
// //   }

//   handleClickBtnAddBestBit() {
//     console.log("handleClickBtnAddBestBit")
//     // const { videoRef } = this.playerRef.current;
//     // const { currentTime } = videoRef;
//     // const { segments, selectedSegments } = this.state;

//     // const closestSegment = m3u8.getClosestSegmentByTime(segments, currentTime);
//     // closestSegment.label = selectedSegments.length + 1;

//     // selectedSegments.push(closestSegment);

//     // this.setState({ selectedSegments });
//   }

//   render() {
//     return (<div>
//       <h1>
//         Video me up
//     </h1>
//       <HLS
//         ref={this.playerRef}
//         url = {this.state.url}
//         hlsConfig = {{enableWorker: false }}
//       />
//       <input id="url" value = "https://prospelling.s3-us-west-2.amazonaws.com/video/Test4/playlist.m3u8"/>
//       <button onClick={this.reloadVideo}>Load Video</button>
//       <button onClick={this.handleClickBtnAddBestBit}>Chop</button>
//     </div>)
//   }

// }

// export default VideoEdit