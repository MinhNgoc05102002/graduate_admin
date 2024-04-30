import { Link } from "react-router-dom";
import { IPropsModal } from "~/types/ICredit";
import styles from "./ModalAdd.module.scss";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { BASE_URL_MEDIA } from "~/services/axios";

export default function BoxCreditInModal(props:IPropsModal) {
    const checkInit = props.checked;
    const [checked, setChecked] = useState(checkInit);

    const credit = props.data;
    const callBackCheck = props.callBackCheck;
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleCheck(event.target.checked);
    };

    const handleCheck = (newState:any) => {
        setChecked(newState);
        if(callBackCheck) callBackCheck(newState, credit.creditId);
    }

    return (
    <div className={`card mb-2 hoverable`}>
        <div className={`${styles.box_padding}`} onClick={() => handleCheck(!checked)}>
            
            <div className="d-flex align-items-center text-color">
                <div>{credit.countFlashcard > 99 ? '99+' : credit.countFlashcard} thuật ngữ</div>
                <div className={`${styles.divider}`}></div>
                <div className="mx-1 flex-shrink-0">
                    <Link to={`/account/${credit?.createdBy}`} className="avatar align-items-center d-flex w-auto">
                        <img src={BASE_URL_MEDIA + '/' + credit?.avatar} className="w-px-20 h-px-20 rounded-circle" />
                    </Link>
                </div>
                <Link to={`/account/${credit?.createdBy}`} className="text-color align-items-center d-flex">
                    <span className="fw-semibold d-block">{credit?.createdBy}</span>
                </Link>
            </div>
            
            <h5 style={{ marginBottom: '5px' }}>{credit.name}</h5>

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
