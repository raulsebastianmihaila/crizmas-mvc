import React, {PropTypes} from 'react';

import Code from './code';

const Api = ({id, text}) => <h4 id={id}>
  <Code text={text} />
</h4>;

Api.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired
};

export default Api;
