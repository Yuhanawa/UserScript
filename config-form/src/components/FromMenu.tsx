import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';



// const items: MenuProps['items'] = [

// ];

interface FromMenuProps {
  menuKey: string;
  setMenuKey: (key: string) => void;
}

const FromMenu: React.FC<FromMenuProps> = ({ menuKey, setMenuKey }) => {
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



  const onClick: MenuProps['onClick'] = (e) => {
    setMenuKey(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[menuKey]} mode="vertical" items={items} />;
};

export default FromMenu;