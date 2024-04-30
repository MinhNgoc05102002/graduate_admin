import { Link } from "react-router-dom";
import { IProps } from "~/types/ICredit";
import styles from "~/pages/account/Account.module.scss";
import { BASE_URL_MEDIA } from "~/services/axios";

export default function BoxCreditAccount(props:IProps) {
    const credit = props.credit;
    
    return (
    <Link to={`/credit/${credit.creditId}`} className={`card mb-2 hoverable`}>
        <div className={`${styles.box_padding}`}>
            
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
        </div>
    </Link>
    )
};
