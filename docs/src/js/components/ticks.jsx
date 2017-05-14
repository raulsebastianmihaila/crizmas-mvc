import React from 'react';
import PropTypes from 'prop-types';

const Ticks = ({text}) => <span className="ticks">{text}</span>;

Ticks.propTypes = {
  text: PropTypes.string.isRequired
};

export default Ticks;
