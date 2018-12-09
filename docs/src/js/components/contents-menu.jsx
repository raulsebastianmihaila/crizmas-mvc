import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'crizmas-router';

import AsideMenu from './aside-menu';

const Menu = ({list, router}) => <ul>
  {list.map((item, i) => {
    const className = router.isPathActive(item.link)
      || (!item.preventActiveFromDescendant && router.isDescendantPathActive(item.link))
        ? 'tree'
        : '';

    return <li key={i}>
      <div className={className}><Link to={item.link}>{item.label}</Link></div>
      {item.children && <Menu list={item.children} router={router} />}
    </li>;
  })}
</ul>;

Menu.propTypes = {
  list: PropTypes.array.isRequired,
  hasParent: PropTypes.bool,
  router: PropTypes.object.isRequired
};

class ContentsMenu extends Component {
  render() {
    return <AsideMenu className="contents-menu">
      <Menu list={this.props.list} router={this.props.router} />
    </AsideMenu>;
  }
}

ContentsMenu.propTypes = {
  list: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired
};

export default ContentsMenu;
