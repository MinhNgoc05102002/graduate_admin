import { Link } from "react-router-dom";
import { IProps } from "~/types/IClass";
import styles from "~/pages/account/Account.module.scss";

export default function BoxClassAccount(props:IProps) {
    const classes = props.class;
    
    return (
    <Link to={`/class/${classes.classId}`} className={`card my-3 hoverable`}>
        <div className={`${styles.box_padding}`}>
            
            <div className="d-flex align-items-center text-color">
                <div>{classes.countCredit > 99 ? '99+' : classes.countCredit} học phần</div>

                <div className={`${styles.divider}`}></div>
                <div>{classes.countJoinDTO > 99 ? '99+' : classes.countJoinDTO} thành viên</div>

            </div>
            
            <h5 className="my-1">
                <i className={`bx bx-group ${styles.icon_folder}`}></i>
                {/* <i className={`bx bxs-school ${styles.icon_folder}`}></i> */}
                {classes.name}
            </h5>
        </div>
    </Link>
    )
};
