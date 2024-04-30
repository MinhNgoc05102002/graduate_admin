import { Link } from "react-router-dom";
import { IPropsModal } from "~/types/ICredit";
import styles from "./ModalAdd.module.scss";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";

export default function BoxFolderInModal(props:IPropsModal) {
    const checkInit = props.checked;
    const [checked, setChecked] = useState(checkInit);

    const folder = props.data;
    const callBackCheck = props.callBackCheck;
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleCheck(event.target.checked);
    };

    const handleCheck = (newState:any) => {
        setChecked(newState);
        if(callBackCheck) callBackCheck(newState, folder.folderId);
    }

    return (
    <div className={`card mb-2 hoverable`}>
        <div className={`${styles.box_padding}`} onClick={() => handleCheck(!checked)}>

            <div className="d-flex align-items-center text-color">
                <div>{folder.countCredit > 99 ? '99+' : folder.countCredit} bộ thẻ</div>
            </div>
            
            <h5 className="my-1">
                <i className={`bx bx-folder ${styles.icon_folder}`}></i>
                {folder.name}
            </h5>
           
            <div className={styles.checked}>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        </div>
    </div>
    )
};
