import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import styles from './CreditComponent.module.scss';
import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';

const MEMORY2 = [
    {
        label: 'Trí nhớ 1 ngày',
        icon: '/src/assets/img/icons/noti_icon_remind.png'
    },
    {
        label: 'Trí nhớ 1 tuần',
        icon: '/src/assets/img/icons/memo_icon_1day.png'
    },
    {
        label: 'Trí nhớ 1 tháng',
        icon: '/src/assets/img/icons/memo_icon_1month.png'
    },
];


export default function SimpleListMenu(props:any) {
    const memories = props.memories;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Điểm trí nhớ của bạn</div>
            
            <div className={styles.box}>
                <div className={styles.text}>
                    <img src={MEMORY2[selectedIndex].icon} className="w-px-30 h-auto rounded-circle" />
                    <Button
                        className={styles.btn}
                        id="lock-button"
                        aria-haspopup="listbox"
                        aria-controls="lock-menu"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClickListItem}
                        endIcon={<span className='fs-2 bx bx-chevron-down'></span>}
                    >
                        {MEMORY2[selectedIndex].label}
                    </Button>
                </div>

                <div className={styles.memory}>30%</div>
            </div>

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
                {MEMORY2.map((option, index) => (
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
    );
}