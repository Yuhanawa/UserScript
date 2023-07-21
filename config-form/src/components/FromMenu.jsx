import React, { useState } from 'react';
import { Menu } from 'antd';


const FromMenu = ({ menuKey, setMenuKey }) => {
  const [items, setItems] = useState([
    {
      label: 'Index ',
      key: 'index',
    },
    {
      label: 'About',
      key: 'about',
      className: 'menu-about',
    },

    {
      label: 'Test',
      key: 'test'
    }
  ]);

  if (window.menu != undefined) {
    const newItems = [...items, ...window.menu];
    setItems(newItems);
  }



  const onClick = (e) => {
    setMenuKey(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[menuKey]} mode="vertical" items={items} />;
};

export default FromMenu;