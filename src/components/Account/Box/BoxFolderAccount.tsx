import { Link } from "react-router-dom";
import { IFolder, IProps } from "~/types/IFolder";
import styles from "~/pages/account/Account.module.scss";

export default function BoxFolderAccount(props:IProps) {
    const folder = props.folder;
    
    return (
    <Link to={`/folder/${folder.folderId}`} className={`card my-3 hoverable`}>
        <div className={`${styles.box_padding}`}>
            
            <div className="d-flex align-items-center text-color">
                <div>{folder.countCredit > 99 ? '99+' : folder.countCredit} bộ thẻ</div>
            </div>
            
            <h5 className="my-1">
                <i className={`bx bx-folder ${styles.icon_folder}`}></i>
                {folder.name}
            </h5>
        </div>
    </Link>
    )
};
