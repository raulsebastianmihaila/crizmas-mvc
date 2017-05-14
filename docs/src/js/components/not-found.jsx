import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'crizmas-router';

const NotFound = (props, context) => {
  const toPath = context.router.currentRouteFragment.urlPath;

  return <div>
    <p>
      Page not found: <Link to={toPath}>{toPath}</Link>
    </p>
  </div>;
};

NotFound.contextTypes = {
  router: PropTypes.object.isRequired
};

export default NotFound;
