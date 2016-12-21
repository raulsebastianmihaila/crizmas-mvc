import React, {PropTypes} from 'react';
import {Input} from 'crizmas-components';

const View = ({controller}) => {
  const xInput = controller.form.get('x');

  return <div>
    <Input {...xInput} value={xInput.getValue()} type="integer" />
    <button onClick={controller.form.submit}>submit</button>
  </div>;
};

View.propTypes = {
  controller: PropTypes.object.isRequired
};

export default View;
