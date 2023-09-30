import { Input, Space, Button, message } from 'antd';
import { useState } from 'react'

const Twitter_user_rule_editor = (props) => {

  const [nameKeyword, setNameKeyword] = useState('');
  const [bioKeyword, setBioKeyword] = useState('');
  const [tweetKeyword, setTweetKeyword] = useState('');

  const addKeyword = (keyword, key) => {
    if (keyword.trim() === "") {
      message.error('值不可为空!!');
      return
    }
    if (props.value.includes(key)) {
      props.onChange(props.value.replace(key, `${key}${keyword}\n`))
    } else {
      props.onChange(`${props.value}\n${key}${keyword}\n`)
    }
    message.success('添加成功!')
  }
  const addNameKeyword = () => {
    addKeyword(nameKeyword, "#name\n")
    setNameKeyword('')
  }
  const addBioKeyword = () => {
    addKeyword(bioKeyword, "#bio\n")
    setBioKeyword('')
  }
  const addTweetKeyword = () => {
    addKeyword(tweetKeyword, "#text\n")
    setTweetKeyword('')
  }

  return (
    <>
      <Space direction="vertical" size="middle">
        <Space.Compact>
          <Input defaultValue="" placeholder='用户名屏蔽词' value={nameKeyword} onChange={i => setNameKeyword(i.target.value)} />
          <Button type="primary" onClick={addNameKeyword}>添加用户名屏蔽词</Button>
        </Space.Compact>
        <Space.Compact>
          <Input defaultValue="" placeholder='用户介绍Bio屏蔽词' value={bioKeyword} onChange={i => setBioKeyword(i.target.value)} />
          <Button type="primary" onClick={addBioKeyword}>添加用户介绍Bio屏蔽词</Button>
        </Space.Compact>
        <Space.Compact>
          <Input defaultValue="" placeholder='推文屏蔽词' value={tweetKeyword} onChange={i => setTweetKeyword(i.target.value)} />
          <Button type="primary" onClick={addTweetKeyword}>添加推文屏蔽词</Button>
        </Space.Compact>
        <Input.TextArea autoSize value={props.value} />
      </Space>
    </>
  );
};

export default Twitter_user_rule_editor;