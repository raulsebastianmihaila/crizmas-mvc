import React from 'react';
import {Link} from 'crizmas-router';

import Logo from '../../logo';
import Api from '../../api';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - TreeController</h2>

  <p>Make sure you check the <Link to="/components">getting started</Link> section first.</p>

  <Api
    id="TreeController"
    text={`
      import {TreeController} from 'crizmas-components';
      // in ES5, TreeController is window.crizmas.TreeController;

      const treeController = new TreeController({
        nodes: [
          {
            label: 'first node',
            children: [
              {
                label: 'first child node'
              }
            ]
          },
          {
            label: 'second node'
          }
        ],
        itemHeight: 20
      });
    `} />

  <ul className="simple-list">
    <li>The nodes option is an array of objects with optional children, label and isExpanded
    properties and any other possible properties.</li>
    <li>The itemHeight must be a number or a function and it is passed to the render clip
    controller.</li>
  </ul>

  <Api
    id="treeController.renderClipController"
    text="treeController.renderClipController" />

  <ul className="simple-list">
    <li>The render clip controller.</li>
  </ul>

  <Api
    id="treeController.setNodes"
    text="treeController.setNodes(nodes)" />

  <ul className="simple-list">
    <li>Calls the render clip controller's setItemsCount method.</li>
  </ul>

  <Api
    id="treeController.refresh"
    text="treeController.refresh()" />

  <ul className="simple-list">
    <li>Calls the render clip controller's refresh method.</li>
  </ul>

  <Api id="treeController.toggleExpand" text="treeController.toggleExpand(node)" />

  <ul className="simple-list">
    <li>If the node is expanded, it will be collapsed. If it is collapsed, it will be expanded.</li>
    <li>Calls the render clip controller's setItemsCount method.</li>
  </ul>
</div>;
