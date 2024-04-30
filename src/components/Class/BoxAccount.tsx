import classNames from "classnames/bind";
import styles from "./ClassComp.module.scss";
import { Link } from "react-router-dom";
import { findNotifDate } from "~/utils/common";
import { BASE_URL_MEDIA } from "~/services/axios";

/**
 * Box Account Dashboard
 * @returns 
 */
export default function BoxAccount(props:any) {
    const {account} = props;
    return (
        <>
            <div className="col-md-4">
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-0">
                            <div className="col-md-4 col-lg-3 col-sm-3 col-3">
                                <Link to={`/account/${account?.username}`} className={`avatar ${styles.avatar_box}`}>
                                    <img src={BASE_URL_MEDIA + '/' + account.avatar} className="w-px-50 h-px-50 rounded-circle" />
                                </Link>
                            </div>

                            <div className={`col-md-8 col-lg-9 col-sm-9 col-9 ${styles.username}`}>
                                <div>
                                    <Link to={`/account/${account?.username}`}>
                                        <h5 className="card-title">{account.username}</h5>
                                    </Link>
                                    <small className={styles.username}>
                                        {findNotifDate(account?.createdAt)}
                                    </small>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};