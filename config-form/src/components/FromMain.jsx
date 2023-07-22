import React from 'react';
import FormRender, { useForm } from 'form-render';
import { useEffect } from 'react';
import { useState } from 'react';



const FromMain = ({ menuKey }) => {
    const form = useForm();
    let winProps = {};
    const [schema, setSchema] = useState({
        type: 'object',
        properties: {
            input: {
                title: '出现错误',
                type: 'string',
                widget: 'input',

            }
        }
    });

    if (window.banana && window.banana[menuKey]) {
        // newSchema=window.banana[menuKey].schema
        winProps = window.banana[menuKey].props;
    }


    useEffect(() => {
        const newProps = {}

        Object.keys(winProps).forEach(key => {
            newProps[key] = {
                type: 'string',
                widget: 'input',
                title: winProps[key].title,
                description: `default: ${winProps[key].default}`,
                default: window.banana[menuKey].get(`${menuKey}_${key}`, winProps[key].default),
            }
        });

        const newSchema = {
            type: 'object',
            properties: newProps
        }

        console.log(newSchema);
        setSchema(newSchema)
    }, [menuKey])

    const onFinish = (data) => {
        console.log('formData:', data);

        Object.keys(data).forEach(key => {
            const value = data[key]
            if (value != schema.properties[key].default) {
                window.banana[menuKey].set(`${menuKey}_${key}`, value)
                console.log("🚀 ~ file: FromMain.jsx:42 ~ Object.keys ~ value:", value)
            }

            location.reload();
        })

    };

    return (
        <FormRender
            form={form}
            schema={schema}
            onFinish={onFinish}
            maxWidth={360}
            footer={{
                submit: {
                    text: '保存',
                    // loading: true
                    // hide: true
                    // ...btnProps
                },
                reset: {
                    text: '刷新',
                    // hide: true
                    // ...btnProps
                }
            }}
        />
    );
}

export default FromMain;