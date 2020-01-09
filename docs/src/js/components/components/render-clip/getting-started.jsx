import React from 'react';

import Logo from '../../logo';

export default () => <div>
  <h2><Logo text="crizmas-components" /> - RenderClip - Getting started</h2>

  <p>The render-clip components are used for scroll virtualization, meaning that you can display a
  big list of items without blocking the browser. More precisely, only a part of the items are
  rendered while for the user it appears that all the items are rendered.</p>

  <p>The render-clip components stretch to occupy all the space available, if their content
  requires it, so for a vertical list you might want to put a container around it with a set height.
  For horizontal lists it's easier since block elements stretch horizontally naturally, so normally
  you don't need to set a width. If needed, you should use a container with a set width.</p>

  <p>Click the render-clip links for more details.</p>
</div>;
