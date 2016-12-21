import React, {PropTypes} from 'react';

const Layout = ({children}) => <div>
  <h1>Getting started example</h1>
  <div>{children}</div>
</div>;

Layout.propTypes = {
  children: PropTypes.any
};

export default Layout;
