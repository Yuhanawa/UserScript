import React, { useState } from 'react';
import { Menu } from 'antd';
import { useEffect } from 'react';


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
    }
  ]);

  useEffect(() => {
    if (window.banana != undefined) {
      let new_menu = [...Object.keys(window.banana)].map(item => { return { label: item, key: item }; })
      const newItems = [...items, ...new_menu];
      console.log(newItems);
      setItems(newItems);
    }
  }, [])



  const onClick = (e) => {
    setMenuKey(e.key);
  };

  return <Menu onClick={onClick} selectedKeys={[menuKey]} mode="vertical" items={items} />;
};

export default FromMenu;