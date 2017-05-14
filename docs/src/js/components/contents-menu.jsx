import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'crizmas-router';

import AsideMenu from './aside-menu';

const Menu = ({list, hasParent}, {router}) => <ul>
  {list.map((item, i) => {
    let className = router.isPathActive(item.link)
      || (!hasParent && router.isDescendantPathActive(item.link))
        ? 'tree'
        : '';

    return <li className={className} key={i}>
      <Link to={item.link}>{item.label}</Link>
      {item.children && <Menu list={item.children} hasParent={true} />}
    </li>;
  })}
</ul>;

Menu.propTypes = {
  list: PropTypes.array.isRequired,
  hasParent: PropTypes.bool
};

Menu.contextTypes = {
  router: PropTypes.object.isRequired
};

class ContentsMenu extends Component {
  render() {
    return <AsideMenu className="contents-menu">
      <Menu list={this.props.list} />
    </AsideMenu>;
  }
}

ContentsMenu.propTypes = {
  list: PropTypes.array.isRequired
};

export default ContentsMenu;
