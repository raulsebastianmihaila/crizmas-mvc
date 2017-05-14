import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'crizmas-router';

const Logo = ({to, text}) => {
  let inner = <span>{text || 'crizmas-mvc'}</span>;

  if (to) {
    inner = <Link to={to}>{inner}</Link>;
  }

  return <span className="logo tree">{inner}</span>;
};

Logo.propTypes = {
  to: PropTypes.string,
  text: PropTypes.string
};

export default Logo;
