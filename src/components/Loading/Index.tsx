import { useState } from 'react';
import styles from './Loading.module.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Loading(props: any) {
    let {isLoading} = props;
    return (
        <>
            {isLoading ?
                <div className={`${styles.container}`}>

                    <div className="spinner-border spinner-border-lg text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div > 
                </div>
            : null}
        </>
    )
};

export function PopupMenu(props: any) {
    let {renderBtn, renderItem} = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    return (
        <div>
            {renderBtn(handleClick)}
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
            >
                {renderItem(handleClose)}
            </Menu>
        </div>
    )
}