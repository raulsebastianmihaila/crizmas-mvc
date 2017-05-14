import React, {Component} from 'react';
import PropTypes from 'prop-types';

const tabStartRegExp = /^\t+/;
const spaceStartRegExp = /^\s+/;
const textRegExp = /\S/;

function getLines(text) {
  let lines = text.split('\n');
  const firstLineIndex = lines.findIndex((line) => textRegExp.test(line));

  if (firstLineIndex === -1) {
    return [];
  }

  let lastLineIndex;

  for (lastLineIndex = lines.length - 1;; lastLineIndex -= 1) {
    if (textRegExp.test(lines[lastLineIndex])) {
      break;
    }
  }

  lines = lines.slice(firstLineIndex, lastLineIndex + 1)
    .map((line) => line.replace(tabStartRegExp, (match) => '  '.repeat(match.length)));

  const startSpaceMatch = lines[0].match(spaceStartRegExp);
  const skippedSpaceCount = startSpaceMatch
    ? startSpaceMatch[0].length
    : 0;

  if (skippedSpaceCount) {
    return lines.map((line) =>
      line.replace(spaceStartRegExp, (match) => ' '.repeat(match.length - skippedSpaceCount)));
  }

  return lines;
}

class Code extends Component {
  shouldComponentUpdate(newProps) {
    return newProps.text !== this.props.text;
  }

  render() {
    // the nbsp is needed so that empty new lines are displayed
    return <div className="code">{getLines(this.props.text)
      .map((line, i) => <div key={i}>{line}&nbsp;</div>)}</div>;
  }
}

Code.propTypes = {
  text: PropTypes.string.isRequired
};

export default Code;
