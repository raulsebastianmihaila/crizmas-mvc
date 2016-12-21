import React, {PropTypes} from 'react';

import AsideMenu from './aside-menu';

const ContentsSubmenu = ({list}) => <AsideMenu className="contents-submenu">
  <ul>
    {list.map((item, i) => <li key={i}>
      <a href={`#${item.link}`}>{item.label}</a>
    </li>)}
  </ul>
</AsideMenu>;

ContentsSubmenu.propTypes = {
  list: PropTypes.array.isRequired
};

export default ContentsSubmenu;
