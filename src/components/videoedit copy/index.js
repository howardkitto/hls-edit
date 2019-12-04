import React from 'react';
import { connect } from 'react-redux';
import { getVideoById } from 'selectors/video';
import { fetchVideo } from 'actions';
import m3u8 from 'utils/m3u8';
import videoHelper from 'utils/video';
import HLSPlayer from 'components/HLSPlayer/HLSPlayer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Screen from 'components/screen';
import { SelectedSegmentsControls, BtnReset, Content, Player, PlayerControls, SelectedSegments, SelectedSegmentHeader } from './styles';
import { BlueButtonElement, RedButtonElement } from '../buttonelement';
import { colors } from '../styles';

const grid = 8;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: 4,

  // change background colour if dragging
  background: isDragging ? colors.primary : 'grey',
  color: 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = () => ({
  padding: 0,
  width: 250,
});

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

    this.playerRef = React.createRef();
    this.handleDragEnd = this.handleDragEnd.bind(this);

    this.handleClickBtnAddBestBit = this.handleClickBtnAddBestBit.bind(this);
    this.handlePlayBestBitsClick = this.handlePlayBestBitsClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  componentWillMount() {
    const { dispatch, match, video } = this.props;
    const { id } = match.params;

    // Don't fetch when the video was already in the state (cached)
    if (video === undefined) {
      dispatch(fetchVideo(id));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isManifestLoaded, isManifestLoading } = this.state;

    if (!isManifestLoaded && !isManifestLoading && nextProps.video && nextProps.video.video) {
      this.setState({
        isManifestLoading: true,
      }, () => {
        const manifestInfo = m3u8.getManifestFileInfo(nextProps.video);

        if (!manifestInfo) {
          return;
        }

        m3u8
          .getVideoManifest(manifestInfo.contentUrl)
          .then((manifest) => {
            const segments = m3u8.getManifestSegments(manifestInfo, manifest);

            console.log(`Developer info: ${segments.length} segment size.`);

            this.setState({
              isManifestLoaded: true,
              isManifestLoading: false,
              segments,
              selectedSegments: [],
            });
          });
      });
    }
  }

  handleDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const { selectedSegments } = this.state;

    const reOrderedSegments = reorder(
      selectedSegments,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      selectedSegments: reOrderedSegments,
    });
  }

  handleClickBtnAddBestBit() {
    const { videoRef } = this.playerRef.current;
    const { currentTime } = videoRef;
    const { segments, selectedSegments } = this.state;

    const closestSegment = m3u8.getClosestSegmentByTime(segments, currentTime);
    closestSegment.label = selectedSegments.length + 1;

    selectedSegments.push(closestSegment);

    this.setState({ selectedSegments });
  }

  handlePlayBestBitsClick() {
    const { selectedSegments } = this.state;

    const modifiedM3u8 = m3u8.getM3u8FromSegments(selectedSegments, 8);
    const modifiedM3u8Url = m3u8.getUrlFromM3u8String(modifiedM3u8);

    this.setState({
      playerUrl: modifiedM3u8Url,
    }, () => {
      setTimeout(() => {
        const { videoRef } = this.playerRef.current;
        videoRef.play();
      }, 500);
    });
  }

  handleResetClick() {
    this.setState({
      selectedSegments: [],
      playerUrl: null,
    });
  }

  renderSelectedSegmentsList() {
    const { selectedSegments } = this.state;

    if (selectedSegments.length === 0) {
      return null;
    }

    return (
      <SelectedSegments>
        <SelectedSegmentHeader>
          <h1>
            Selected segments
          </h1>
          <SelectedSegmentsControls>
            <BlueButtonElement onClick={this.handlePlayBestBitsClick}>
              Play Best Bits
            </BlueButtonElement>
            <BtnReset>
              <RedButtonElement onClick={this.handleResetClick}>
                Reset
              </RedButtonElement>
            </BtnReset>
          </SelectedSegmentsControls>
        </SelectedSegmentHeader>
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {selectedSegments.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        Best bit #{item.label}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </SelectedSegments>
    );
  }

  render() {
    const { isManifestLoaded, playerUrl } = this.state;
    const { video } = this.props;

    if (!isManifestLoaded) {
      return null;
    }

    const masterUrl = videoHelper.getVideoMasterUrl(video);
    const url = playerUrl || masterUrl;

    return (
      <Screen>
        <Content>
          <Player>
            <HLSPlayer
              ref={this.playerRef}
              url={url}
            />
            <PlayerControls>
              <BlueButtonElement onClick={this.handleClickBtnAddBestBit}>
                Add best bit
              </BlueButtonElement>
            </PlayerControls>
          </Player>
          {this.renderSelectedSegmentsList()}
        </Content>
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  video: getVideoById(ownProps.match.params.id)(state),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoEdit);
