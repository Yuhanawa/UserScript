import React from 'react';
import FormRender, { useForm } from 'form-render';
import { useEffect } from 'react';
import { useState } from 'react';
import Line from './Line.jsx';
import { Button } from 'antd';



const FromMain = ({ menuKey }) => {
    const form = useForm();
    let winProps = {};
    const [schema, setSchema] = useState({});

    if (window.banana && window.banana[menuKey])
        winProps = window.banana[menuKey].props;


    useEffect(() => {
        const newProps = {}

        Object.keys(winProps).forEach(key => {
            newProps[key] = {
                type: 'string',
                widget: 'input',
                title: key,

                ...winProps[key],

                default: window.banana[menuKey].get(`${menuKey}_${key}`, winProps[key].default),
                extra: `default: ${winProps[key].default}`,

            }

            if (winProps[key].extra) {
                if (newProps[key].widget == 'line') newProps[key].extra = winProps[key].extra
                else newProps[key].extra = winProps[key].extra + ` default: ${(winProps[key].default??winProps[key].defaultValue)??""}`
            }
        });

        const newSchema = {
            type: 'object',
            column: window.innerWidth > 720 ? 2 : 1,
            properties: newProps
        }

        console.log(newSchema);
        setSchema(newSchema)
    }, [menuKey])

    const onFinish = (data) => {
        console.log('formData:', data);

        for (var key of Object.keys(data)) {
            if (key.startsWith('.')) continue;

            const value = data[key]
            if (value != schema.properties[key].default) {
                window.banana[menuKey].set(`${menuKey}_${key}`, value)
            }

            location.reload();
        }

    };

    const onSaveBtnClick = () => {
        form.submit();
    };
    const onCancelBtnClick = () => {
        location.reload();
    };

    return (
        <>
            <FormRender
                form={form}
                schema={schema}
                widgets={{ Line }}
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