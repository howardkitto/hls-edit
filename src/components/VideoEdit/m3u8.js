import shortId from 'shortid';

const getManifestFileInfo = (video, EDIT_QUALITY = '1080p') => {
  const videoFiles = video.video;

  if (!videoFiles) {
    return null;
  }

  const m3u8File = videoFiles.filter(vf => vf.contentUrl.includes(`hls_${EDIT_QUALITY}.m3u8`));

  if (m3u8File[0] && m3u8File[0].contentUrl) {
    return m3u8File[0];
  }

  return null;
};

const getVideoManifest = async (url) => {
  const res = await fetch(url.replace('api-', ''));
  return res.text();
};

const getSegmentUrl = ({ contentUrl }, fileName) => {
  const relativeUrlRoot = contentUrl.substring(0, contentUrl.lastIndexOf('/') + 1);
  return relativeUrlRoot + fileName;
};

const getManifestSegments = (manifestInfo, manifest) => {
  const reg = /#EXTINF:([0-9.]*),\n([^\n]*)/gm;
  let result = reg.exec(manifest);
  const segments = [];

  while (result !== null) {
    const [, duration, fileName] = result;
    const id = shortId.generate();

    segments.push({
      id,
      duration,
      fileName,
      url: getSegmentUrl(manifestInfo, fileName),
    });

    result = reg.exec(manifest);
  }

  return segments;
};

const getParsedSegments = (segments) => {
  let output = '';

  const segmentsLength = segments.length;

  for (let i = 0; i < segmentsLength; i += 1) {
    const currentSegment = segments[i];
    const isFirstIteration = i === 0;

    if (!isFirstIteration) {
      output += '#EXT-X-DISCONTINUITY\n';
    }

    output += `#EXTINF:${currentSegment.duration},\n`;
    output += `${currentSegment.url}\n`;
  }

  return output;
};

const getM3u8FromSegments = (segments, targetDuration = 0) => {
  const parsedSegments = getParsedSegments(segments);
  let output = '';

  output += '#EXTM3U\n';
  output += '#EXT-X-VERSION:3\n';
  output += '#EXT-X-MEDIA-SEQUENCE:0\n';
  output += '#EXT-X-ALLOW-CACHE:YES\n';
  output += `#EXT-X-TARGETDURATION:${targetDuration}\n`;
  output += parsedSegments;
  output += '#EXT-X-ENDLIST';

  return output;
};

const getUrlFromM3u8String = m3u8String => `data:application/x-mpegURL;base64,${window.btoa(m3u8String)}`;

const isBetween = (x, start, end) => (x >= start && x <= end);

const getClosestSegmentByTime = (segments, time) => {
  let startTime = 0;

  for (const segment of segments) {
    const segmentStart = startTime;
    const segmentEnd = segmentStart + Number(segment.duration);

    if (isBetween(time, segmentStart, segmentEnd)) {
      return segment;
    }

    startTime = segmentEnd;
  }

  return null;
};

export default {
  getManifestFileInfo,
  getVideoManifest,
  getManifestSegments,
  getM3u8FromSegments,
  getUrlFromM3u8String,
  getClosestSegmentByTime,
};
