import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const getVideos = state => state.videos.byId;

const getVideoById = id => createSelector(
    [getVideos],
    videos => videos[id],
  );

class VideoEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isManifestLoaded: false,
            isManifestLoading: false,
            segments: null,
            selectedSegments: [],
            playerUrl: null,
        };
    }

    render() {
        const { isManifestLoaded, playerUrl } = this.state;
        const { video } = this.props;

        if (!isManifestLoaded) {
            return null;
        }

        return (

            <h2>
                Video Component
            </h2>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    video: getVideoById("videFileURL")(state),
  });

export default connect(mapStateToProps)(VideoEdit)