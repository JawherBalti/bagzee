import React from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Input, Tag} from 'antd';
import {TweenOneGroup} from 'rc-tween-one';
import {useEffect, useRef, useState} from 'react';

const Tags = () => {
    const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };
    const forMap = (tag) => {
        const tagElem = (
            <Tag
                className='bttn gap-2 d-flex justify-content-around align-items-center mx-2'
                style={{
                    background: '#53BFED',
                    color: '#fff',
                    display: 'inline-block',
                    fontSize: '1rem',
                    minWidth: 'max-content',
                    border: '1px solid #53BFED'
                }} closable
                onClose={(e) => {
                    e.preventDefault();
                    handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (
            <span
                key={tag}
                style={{
                    display: 'inline-block',
                    color: '#fff',
                }}
            >
        {tagElem}
      </span>
        );
    };
    const tagChild = tags.map(forMap);
    const tagPlusStyle = {
        background: "#eee",
        borderStyle: 'dashed',
    };
    return (
        <>
            <div
                style={{
                    marginBottom: 16,
                }}
            >
                <TweenOneGroup
                    enter={{
                        scale: 0.8,
                        opacity: 0,
                        type: 'from',
                        duration: 100,
                    }}
                    onEnd={(e) => {
                        if (e.type === 'appear' || e.type === 'enter') {
                            e.target.style = 'display: inline-block';
                        }
                    }}
                    leave={{
                        opacity: 0,
                        width: 0,
                        scale: 0,
                        duration: 200,
                    }}
                    appear={false}
                >
                    {tagChild}
                </TweenOneGroup>
            </div>
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{
                        width: 78,
                    }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Tag onClick={showInput} className='bttn gap-2 d-flex justify-content-around align-items-center'
                     style={{
                         fontSize: '1rem',
                         minWidth: 'max-content',
                         border: '1px solid #e8e8e8'
                     }}>
                    <PlusOutlined/> Ajouter
                </Tag>
            )}
        </>
    );
};
export default Tags;