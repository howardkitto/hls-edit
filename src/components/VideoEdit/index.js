import React, {useState} from 'react';
import HLS from '../HLSPlayer/HLSPlayer';


const VideoEdit = () => {

    const [url, setUrl] = useState(["https://prospelling.s3-us-west-2.amazonaws.com/video/Test4/playlist.m3u8"]);

    let playerRef = React.createRef();

    return <div>

        <HLS
            ref={playerRef}
            url={"https://prospelling.s3-us-west-2.amazonaws.com/video/Test4/playlist.m3u8"}
            autoplay = {false}
            hlsConfig={{ enableWorker: false }}
        />
        <input id="url"/>
        <button onClick={setUrl}>Load Video</button>
    </div>

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