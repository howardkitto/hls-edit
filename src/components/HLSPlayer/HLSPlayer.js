/* eslint-disable react/forbid-prop-types, jsx-a11y/media-has-caption */

import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

class HLSPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerId: Date.now(),
    };

    this.hls = null;
    this.videoRef = null;
    this.destroyPlayer = this.destroyPlayer.bind(this);
  }

  componentDidMount() {
    this.initPlayer(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { url } = this.props;
    const hasUrlChanged = url !== nextProps.url;

    if (hasUrlChanged) {
      this.initPlayer(nextProps);
    }
  }

  componentWillUnmount() {
    this.destroyPlayer();
  }

  initPlayer(props) {
    this.destroyPlayer();

    const { url, autoplay, hlsConfig } = props;

    const { videoRef } = this;
    const hls = new Hls(hlsConfig);

    hls.loadSource(url);
    hls.attachMedia(videoRef);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoplay) {
        videoRef.play();
      }
    });

    this.hls = hls;
  }

  destroyPlayer() {
    const { hls } = this;

    if (hls) {
      hls.destroy();
    }
  }

  render() {
    const { playerId } = this.state;
    const { controls, width, height, poster, videoProps } = this.props;

    return (
      <div key={playerId}>
        <video
          ref={(r) => {
            this.videoRef = r;
          }}
          id={`hls-player-${playerId}`}
          controls={controls}
          width={width}
          height={height}
          poster={poster}
          {...videoProps}
        />
      </div>
    );
  }
}

HLSPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,

  // https://github.com/dailymotion/hls.js/blob/master/API.md#fine-tuning
  hlsConfig: PropTypes.object,
  controls: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  poster: PropTypes.string,
  videoProps: PropTypes.object,
};

HLSPlayer.defaultProps = {
  autoPlay: false,
  hlsConfig: {},
  controls: true,
  width: 640,
  height: 360,
  poster: null,
  videoProps: {},
};

export default HLSPlayer;
