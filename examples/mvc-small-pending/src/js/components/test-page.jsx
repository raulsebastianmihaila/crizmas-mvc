import React from 'react';

import controller from 'js/controllers/test-controller';

export default () => <div>
  {controller.isPending && <div>An operation is pending.</div>}

  {controller.pending.has('secondOperation') && <div>The second operation is special so while
    it's pending we're displaying this text.</div>}

  {controller.child.isPending && <div>Child is pending.</div>}

  <button onClick={() => controller.firstOperation()}
    disabled={controller.isPending}>first operation</button>
  <button onClick={() => controller.secondOperation()}
    disabled={controller.isPending}>second operation</button>
  <button onClick={() => controller.child.childOperation()}
    disabled={controller.isPending}>child operation</button>
  <button onClick={controller.firstOperation}
    disabled={controller.isPending}>wrong operation call</button>
</div>;
