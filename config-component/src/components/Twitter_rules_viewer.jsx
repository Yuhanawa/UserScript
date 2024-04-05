import React, { useEffect, useState } from 'react';
import { Avatar, Popover, Collapse, Divider, Card, Button, List, Skeleton, Input, Space, message } from 'antd';
const { Meta } = Card;


function parseRule(str) {
  if (!str || str.trim() === '') return;
  let key;
  const rule = {};
  for (line of str.split('\n')) {
    line = line.trim();
    if (!line || line.startsWith('//')) continue;

    if (line.startsWith('#')) {
      key = line.slice(1);
      if (line.startsWith('#rule-')) {
        rule[key] = '';
      } else {
        rule[key] = [];
        rule[key + "-reg"] = [];
      }
    } else {
      if (key.startsWith('rule-'))
        rule[key] += line
      else if (line.startsWith('/') && line.endsWith('/'))
        rule[key + "-reg"].push(new RegExp(line.slice(1, line.length - 1)))
      else
        rule[key].push(line);
    }
  };
  return rule;
}



const Twitter_rules_viewer = (props) => {


  const [rules, setRules] = useState([]);
  const [data, setData] = useState(props.value);


  useEffect(() => {
    const newRules = [];
    for (const key of Object.keys(data)) {
      const rule = parseRule(data[key]);
      newRules.push({ url: key, ...rule });
    }

    setRules(newRules);
  }, [])


  return (
    <Space direction="vertical" size="middle">

      {rules.map((rule) => (
        <Card style={{ width: 300, marginTop: 4 }}
          // loading={loading}
          key={rule.key}
          actions={[
            <Popover
              content={
                <div>
                  <div>
                    <p>rule-name: {rule['rule-name']}</p>
                    <p>rule-description: {rule['rule-description']}</p>
                    <p>rule-more: {rule['rule-more']}</p>
                    <p>rule-lastupdate: {rule['rule-lastupdate']}</p>
                    <p>url: {rule['url']}</p>
                  </div>
                  <Divider />
                  <Collapse items={[{
                    key: '1', label: '详情(可能存在NSFW)', children: <div>
                      <div>
                        <p>name: <div>{rule['name']?.map(x => <li>{x}</li>)}</div></p>
                        <Divider dashed />
                        <p>id: <div>{rule['id']?.map(x => <li>{x}</li>)}</div></p>
                        <Divider dashed />
                        <p>id_num: <div>{rule['id_num']?.map(x => <li>{x}</li>)}</div></p>
                        <Divider dashed />
                        <p>bio: <div>{rule['bio']?.map(x => <li>{x}</li>)}</div></p>
                        <Divider dashed />
                        <p>all: <div>{rule['all']?.map(x => <li>{x}</li>)}</div></p>
                      </div>
                    </div>
                  }]}>
                  </Collapse>

                </div>
              }
              title="内容"
              trigger="click"
            >
              <Button type="primary">查看内容</Button>
            </Popover >
            // <Button type="primary" onClick={message.open} > 查看</Button>,
            // <Button type="default" onClick={message.error("此按钮功能还没做 TODO")} > 删除</Button>

          ]}
        >
          <Meta
            // avatar={<Avatar />}
            title={"屏蔽规则名称:  " + rule['rule-name']}
            description={""}
          />
          <li>描述: {rule['rule-description']} ({rule['rule-more']})</li>
          <li>最后更新时间: {rule['rule-lastupdate']}</li>
          <li></li>
        </Card >
      ))}

      <line></line>
      {/* <Space>
        <row>
          <label>添加屏蔽规则:</label>
          <input></input>
          <button>添加</button>
        </row>
      </Space> */}
    </Space >

  );
};

export default Twitter_rules_viewer;