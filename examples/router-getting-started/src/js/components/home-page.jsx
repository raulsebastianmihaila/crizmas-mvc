import React from 'react';
import {Link} from 'crizmas-router';

export default () => <div>
  <h2>This is the home page</h2>
  <div>Go to the <Link to="/flowers">flowers</Link> page.</div>
</div>;
