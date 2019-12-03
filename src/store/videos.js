const LOADING_VIDEO = { identifier: 'loading-video' };

const INITIAL_STATE = {
    byId: { [LOADING_VIDEO.identifier]: LOADING_VIDEO },
    progress: {},
    ids: [],
    entryModified: false,
    liveStreamId: '',
    videos: []
};

const videos = (state = INITIAL_STATE) => {

    return state.videos


}