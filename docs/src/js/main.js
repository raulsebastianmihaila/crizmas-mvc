import Mvc from 'crizmas-mvc';
import Router from 'crizmas-router';

import Layout from './components/layout';
import NotFound from './components/not-found';
import Home from './components/home';
import MvcGettingStarted from './components/mvc/getting-started';
import MvcIntroduction from './components/mvc/introduction';
import MvcTheory from './components/mvc/theory';
import MvcApi from './components/mvc/api';
import FormGettingStarted from './components/form/getting-started';
import FormTheory from './components/form/theory';
import FormApi from './components/form/api';
import RouterGettingStarted from './components/router/getting-started';
import RouterTheory from './components/router/theory';
import RouterApi from './components/router/api';
import ComponentsGettingStarted from './components/components/getting-started';
import Input from './components/components/input';
import RenderClipGettingStarted from './components/components/render-clip/getting-started';
import RenderClip from './components/components/render-clip/render-clip';
import RenderClipController from './components/components/render-clip/render-clip-controller';
import RenderClip2D from './components/components/render-clip/render-clip-2d';
import RenderClip2DController from './components/components/render-clip/render-clip-2d-controller';
import Tree from './components/components/tree/tree';
import TreeController from './components/components/tree/tree-controller';
import Tools from './components/tools/tools';
import Applications from './components/applications/applications';
import Articles from './components/articles/articles';

new Mvc({
  component: Layout,
  domElement: document.querySelector('#app'),
  router: new Router({
    basePath: process.env.basePath,
    routes: [
      {
        controller: {
          onEnter({router}) {
            const path = router.url.searchParams.get('path');

            if (path) {
              router.transitionTo(`${path}${router.url.hash}`);
            }
          }
        },
        children: [
          {
            path: '*',
            component: NotFound
          },
          {
            component: Home
          },
          {
            path: 'getting-started',
            component: MvcGettingStarted
          },
          {
            path: 'introduction',
            component: MvcIntroduction
          },
          {
            path: 'theory',
            component: MvcTheory
          },
          {
            path: 'api',
            component: MvcApi
          },
          {
            path: 'router',
            children: [
              {
                component: RouterGettingStarted
              },
              {
                path: 'theory',
                component: RouterTheory
              },
              {
                path: 'api',
                component: RouterApi
              }
            ]
          },
          {
            path: 'form',
            children: [
              {
                component: FormGettingStarted
              },
              {
                path: 'theory',
                component: FormTheory
              },
              {
                path: 'api',
                component: FormApi
              }
            ]
          },
          {
            path: 'components',
            children: [
              {
                component: ComponentsGettingStarted
              },
              {
                path: 'input',
                component: Input
              },
              {
                path: 'render-clip',
                children: [
                  {
                    component: RenderClipGettingStarted
                  },
                  {
                    path: 'render-clip',
                    component: RenderClip
                  },
                  {
                    path: 'render-clip-controller',
                    component: RenderClipController
                  },
                  {
                    path: 'render-clip-2d',
                    component: RenderClip2D
                  },
                  {
                    path: 'render-clip-2d-controller',
                    component: RenderClip2DController
                  }
                ]
              },
              {
                path: 'tree',
                children: [
                  Router.fallbackRoute({path: '', to: '/components/tree/tree', replace: true}),
                  {
                    path: 'tree',
                    component: Tree
                  },
                  {
                    path: 'tree-controller',
                    component: TreeController
                  }
                ]
              }
            ]
          },
          {
            path: 'tools',
            component: Tools
          },
          {
            path: 'applications',
            component: Applications
          },
          {
            path: 'articles',
            component: Articles
          }
        ]
      }
    ]
  })
});
