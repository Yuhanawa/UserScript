import React from 'react';
import FormRender, { useForm } from 'form-render';
import { useEffect } from 'react';
import { useState } from 'react';
import Line from './Line.jsx';
import Twitter_user_rule_editor from './Twitter_user_rule_editor.jsx';
import Twitter_rules_viewer from './Twitter_rules_viewer.jsx';
import CSDN_UI_editor from './CSDN_UI_editor.jsx';
import { Button, Anchor, Form, Radio } from 'antd';


const FromMain = ({ menuKey }) => {
    const form = useForm();
    let winProps = {};
    const [schema, setSchema] = useState({});
    const [anchors, setAnchors] = useState([]);

    const [fromColumn, setFromColumn] = useState(2);
    const [fromDisplayType, setFromDisplayType] = useState('column');

    const handFromColumnChange = (ev) => {
        const value = ev.target.value;
        schema.column = value;

        form.setSchema(schema, true);
        setFromColumn(value);
    };
    const handFromDisplayType = (ev) => {
        const value = ev.target.value;
        schema.displayType = value;
        form.setSchema(schema, true);
        setFromDisplayType(value);
    };


    if (window.awa.userscript?.[menuKey])
        winProps = window.awa.userscript[menuKey].props;


    useEffect(() => {
        const newProps = {}

        Object.keys(winProps).forEach(key => {
            newProps[key] = {
                type: 'string',
                widget: 'input',
                title: key,

                ...winProps[key],

                default: window.awa.userscript[menuKey].get(`${menuKey}_${key}`, winProps[key].default),
                extra: `default: ${winProps[key].default}`,

            }

            if (winProps[key].extra) {
                if (newProps[key].widget == 'line') newProps[key].extra = winProps[key].extra
                else newProps[key].extra = winProps[key].extra + ` default: ${(winProps[key].default ?? winProps[key].defaultValue) ?? ""}`
            }
        });

        const newSchema = {
            type: 'object',
            column: window.innerWidth > 720 ? 2 : 1,
            properties: newProps
        }

        // console.log(newSchema);
        setSchema(newSchema)

        setAnchors([
            {
                key: 'top',
                href: `#config-top`,
                title: 'Top',
            }
        ].concat(window.awa.userscript?.[menuKey]?.anchors || []));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuKey])

    const onFinish = (data) => {
        // console.log('formData:', data);

        for (const key of Object.keys(data)) {
            if (key.startsWith('.') || key.startsWith('#')) continue;

            const value = data[key]
            // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
            if (value != schema.properties[key].default) {
                window.awa.userscript[menuKey].set(`${menuKey}_${key}`, value)
            }

            location.reload();
        }

    };

    const onSaveBtnClick = () => form.submit();
    const onCancelBtnClick = () => location.reload();


    return (
        <>
            <div id='config-top' style={{ padding: "0 0 18px 0", margin: "-2px" }}>
                <div style={{ backgroundColor: "#FCFCFC", padding: "8px", borderRadius: "8px" }}>
                    <Anchor
                        direction="horizontal"
                        items={anchors}
                        affix={true} /* don't work */
                        offsetTop={"16px"}
                    />
                </div>
            </div>

            <div>
                <Form.Item label='表单排版' style={{ margin: '0px 1px 24px' }}>
                    <Radio.Group value={fromDisplayType} onChange={handFromDisplayType} style={{ margin: "0px 6px" }}>
                        <Radio.Button value='row'>row</Radio.Button>
                        <Radio.Button value='column'>column</Radio.Button>
                        <Radio.Button value='inline' disabled>Inline</Radio.Button>
                    </Radio.Group>
                    <Radio.Group value={fromColumn} onChange={handFromColumnChange} style={{ margin: "0px 6px" }}>
                        <Radio.Button value={1}>一列</Radio.Button>
                        <Radio.Button value={2}>两列</Radio.Button>
                        <Radio.Button value={3}>三列</Radio.Button>
                        <Radio.Button value={4}>四列</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </div>

            <FormRender
                form={form}
                schema={schema}
                widgets={{ Line, Twitter_user_rule_editor, CSDN_UI_editor, Twitter_rules_viewer }}
                onFinish={onFinish}
                maxWidth={360}
                footer={false}
            />
            <div style={{ position: 'fixed', bottom: '18px', right: '24px', zIndex: 999, fontSize: '18px', width: 'auto', height: 'auto' }}>
                <Button onClick={onCancelBtnClick} type="default" size='large'
                    style={{ position: 'relative', border: '1px solid #4ea1db', margin: "8px" }}>取消</Button>
                <Button onClick={onSaveBtnClick} type="primary" size='large'
                    style={{ position: 'relative', border: '1px solid #4ea1db', margin: "8px", boxShadow: '1px 1px 14px #4ea1db' }}>保存</Button>
            </div >
        </>
    );
}

export default FromMain;