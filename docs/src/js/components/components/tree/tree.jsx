import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../../logo';
import Code from '../../code';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - Tree</h2>

  <p>Make sure you check the <Link to="/components">getting started</Link> section first.</p>

  <p>The Tree component requires an instance of TreeController. It uses <Link
  to="/components/render-clip/render-clip">RenderClip</Link> for scroll virtualization. It can
  receive an optional indentation that is used for indenting the nodes. The default indentation
  is 20. It can also receive an optional renderExpandToggle function that receives the item and a
  toggleExpand function. The renderExpandToggle must render the expand/collapse button.
  In order to expand/collapse an item, the toggleExpand function
  must be called and it must receive the item as an argument. However, if no renderExpandToggle
  is passed, the default will render the label property of the node, so in that case the nodes
  must have a label property.</p>

  <b>
    <Code text={`
      import {Tree} from 'crizmas-components';
      // in ES5, Tree is window.crizmas.Tree;

      <Tree
        controller={treeController}
        indentation={60}
        renderExpandToggle={({item, toggleExpand}) => <button
          style={{marginRight: 10}}
          onClick={toggleExpand.bind(null, item)}>
          {item.isExpanded ? '-' : '+'}
        </button>} />
    `} />
  </b>
</div>;
