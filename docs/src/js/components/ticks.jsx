import React, {PropTypes} from 'react';

const Ticks = ({text}) => <span className="ticks">{text}</span>;

Ticks.propTypes = {
  text: PropTypes.string.isRequired
};

export default Ticks;
