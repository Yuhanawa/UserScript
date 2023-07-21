import React from 'react';
import FormRender, { useForm } from 'form-render';



const FromMain = ({ menuKey }) => {
    const form = useForm();
    let schema = {
        type: 'object',
        properties: {
            input: {
                title: '出现错误',
                type: 'string',
                widget: 'input',
            }
        }
    }

    if (window.banana && window.banana.menuKey && window.banana.menuKey.schema) {
        schema = window.banana.menuKey.schema;
    }

    const onFinish = (formData) => {
        console.log('formData:', formData);
    };

    return (
        <FormRender
            form={form}
            schema={schema}
            onFinish={onFinish}
            maxWidth={360}
            footer={true}
        />
    );
}

export default FromMain;