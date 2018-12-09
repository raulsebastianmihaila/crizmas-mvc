import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'crizmas-router';

const NotFound = ({routeFragment}) => {
  const toPath = routeFragment.router.currentRouteFragment.urlPath;

  return <div>
    <p>
      Page not found: <Link to={toPath}>{toPath}</Link>
    </p>
  </div>;
};

NotFound.propTypes = {
  routeFragment: PropTypes.object.isRequired
};

export default NotFound;
