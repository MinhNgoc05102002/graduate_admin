import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import React, { useEffect, useId, useRef, useState } from "react";
import { countries2 } from "~/utils/common";
import styles from "./BoxCreateCard.module.scss";
import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/material/styles';
import { LightTooltip } from '../Common';
import { BASE_URL_MEDIA } from '~/services/axios';

function DropDownLang(props:any) {
    const {setValue, nameInput, initIndex} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(initIndex ? initIndex : 0);

    const open = Boolean(anchorEl);
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        setValue(nameInput,countries2[initIndex].key);
    }, [initIndex]);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        setValue(nameInput,countries2[index].key);

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    

    return (
        <div className={styles.text}>
            <Button
                className={styles.btn}
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickListItem}
            >
                {countries2[selectedIndex].label}
            </Button>

            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >
                {countries2.map((option, index) => (
                    <MenuItem
                        key={option.label}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default function BoxCreateCard(props:any) {
    const {item, ordinal, register, setValue, errors, remove, previewInit} = props;
    const [selectedFile, setSelectedFile] =  useState();
    const [preview, setPreview] = useState('') 
    const myRef = useRef<any>();
    // const openai = new OpenAI();
    // async function main() {
    //     const completion = await openai.chat.completions.create({
    //       messages: [{ role: "system", content: "You are a helpful assistant." }],
    //       model: "gpt-3.5-turbo",
    //     });
      
    //     console.log(completion.choices[0]);
    //   }

    //   main();

    // for input preview img
    const { onChange, onBlur, name, ref } = register(`flashcardDTOs.${ordinal}.imageFile`);

    useEffect(() => {
        if (!selectedFile) {
            setPreview("")
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
    
    const handleSelectImg = (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])

        onChange(e);
    }

    return (
        <div ref={myRef} className={`card my-4 animate__fast`}>
            <div className={`${styles.head}`}>
                <div className={styles.stt}>
                    {ordinal + 1}
                </div>
                <div className={styles.icon}>
                    <span 
                        onClick={() => { 
                            let elem = myRef.current;
                            elem.classList.add('animate__animated');
                            elem.classList.add('animate__zoomOut');
                            setTimeout(() => {
                                remove(ordinal); 
                            }, 500);
                        }} 
                        className='bx bx-trash cursor-pointer'
                    ></span>
                </div>
            </div>
            <hr />
            <div className={`${styles.form} row`}>
                <div className="word row col-11">
                    <div className={`col ${styles.question}`}>
                        <TextField
                            required
                            label="Thuật ngữ"
                            fullWidth
                            variant="standard" 
                            size="small"
                            {...register(`flashcardDTOs.${ordinal}.question`)} // trong register này có cả  { onChange, onBlur, name, ref } = register('firstName'); rồi nên k cần thêm j nữa 
                            error={errors['flashcardDTOs']?.[ordinal]?.['question'] ? true : false}
                            helperText={errors['flashcardDTOs']?.[ordinal]?.['question'] ? errors['flashcardDTOs']?.[ordinal]?.['question']?.['message'] : ""}
                        />
                        <DropDownLang 
                            setValue={setValue} 
                            initIndex= {19}
                            nameInput={`flashcardDTOs.${ordinal}.questionLang`}
                        />

                    </div>

                    <div className={`col ${styles.answer}`}>
                        <TextField
                            required
                            label="Định nghĩa"
                            fullWidth
                            variant="standard" 
                            size="small"
                            {...register(`flashcardDTOs.${ordinal}.answer`)}
                            error={errors['flashcardDTOs']?.[ordinal]?.['answer'] ? true : false}
                            helperText={errors['flashcardDTOs']?.[ordinal]?.['answer'] ? errors['flashcardDTOs']?.[ordinal]?.['answer']?.['message'] : ""}
                        />
                        <DropDownLang 
                            setValue={setValue} 
                            nameInput={`flashcardDTOs.${ordinal}.answerLang`}
                            initIndex= {92}
                        />
                    </div>
                </div>
                <div className="col-1">
                    {/* <Tooltip title="Chọn ảnh" placement="top" arrow > */}
                    <LightTooltip title="Định dạng file không hợp lệ" placement="top" arrow open={errors['flashcardDTOs']?.[ordinal]?.['imageFile'] ? true : false}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                    >
                        {/* <label htmlFor={`flashcardDTOs.${ordinal}.imageFile`} className={styles.image} style={{backgroundImage: `url(${preview ? preview : "/src/assets/img/icons/image-add-icon.png"}`  }}> */}
                        <label htmlFor={`flashcardDTOs.${ordinal}.imageFile`} className={styles.image} >
                            {<img className={styles.image_tag} src={preview ? preview : (previewInit ? BASE_URL_MEDIA + '/' + previewInit : "/src/assets/img/icons/image-add-icon.png")} alt="" />}
                        </label>
                    </LightTooltip>
                    {/* </Tooltip> */}
                    <div style={{display: "none"}}>
                        <TextField
                            required
                            id= {`flashcardDTOs.${ordinal}.imageFile`}
                            type="file"
                            // accept="image/*"
                            inputProps={{ accept: 'image/*' }}
                            onChange={handleSelectImg}
                            onBlur={onBlur} // assign onBlur event
                            name={name} // assign name prop
                            ref={ref} // assign ref prop

                            // {...register(`flashcardDTOs.${ordinal}.imageFile`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};
