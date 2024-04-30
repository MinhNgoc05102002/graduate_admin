import { useEffect, useState } from "react";
import styles from "./Account.module.scss";
import classNames from "classnames/bind";
import ListCredit from "~/components/Account/ListCredit";
import { CheckResponseSuccess, GetIdFromCurrentPage, GetPreIdFromCurrentPage } from "~/utils/common";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { BASE_URL_MEDIA, Post } from "~/services/axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import NotFound from "../notfound/NotFound";
import Loading from "~/components/Loading/Index";
import ListFolder from "~/components/Account/ListFolder";
import ListClass from "~/components/Account/ListClass";
import Maintain from "../maintain/Maintain";

const cx = classNames.bind(styles);

const LIST_NAVBAR = [
    {
        id: "CREDIT",
        title: "Bộ thẻ",
        url: '',
        component: ListCredit,
    },
    {
        id: "FOLDER",
        title: "Thư mục",
        url: '/folders',
        component: ListFolder,
    },
    {
        id: "CLASS",
        title: "Lớp học",
        url: '/classes',
        component: ListClass,
    },
    {
        id: "STREAK",
        title: "Lịch sử học tập",
        url: '/history',
        component: Maintain,
    },
];

export default function Account() {
    const [content, setContent] = useState<any>(LIST_NAVBAR[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser|null>(null);
    const userData = useAppSelector(inforUser);
    const username = GetIdFromCurrentPage();
    const currentTab = GetPreIdFromCurrentPage();
    const navigate = useNavigate();

    useEffect(() => {
        getInfoUser();
    }, [username, currentTab]);


    const getInfoUser = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            `/api/Account/get-account-by-username`, 
            username, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let account = res?.returnObj;

                let tab:any = LIST_NAVBAR[0];
                if (currentTab != null && currentTab != undefined && currentTab.toLowerCase() != 'account') {
                    tab = LIST_NAVBAR.find(tab => tab.url == "/" + currentTab);
                }

                if (tab && account) {
                    setContent(tab);
                    setCurrentUser(account);
                }
                else setCurrentUser(null)
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    }; 

    if (!currentUser) {
        return (
            <>
                {isLoading ? null : <NotFound />}
                <Loading isLoading={isLoading}/>
                <ToastContainer />
            </>
        )
    }

    return (
        <>
            <Loading isLoading={isLoading}/>
            <ToastContainer />
            {/* <!-- Content --> */}
            <div className="container-xxl flex-grow-1 container-p-y">

                <div className="header">
                    <div className="row g-0">
                        {/* Avatar */}
                        <div className="col-md-1 col-lg-1 col-sm-2 col-3">
                            <div className={`avatar ${styles.avatar_box}`}>
                                <img src={BASE_URL_MEDIA + '/' + currentUser.avatar} className="w-px-75 h-px-75 rounded-circle" />
                            </div>
                        </div>
                        {/* Username */}
                        <div className={`col-md-11 col-lg-11 col-sm-10 col-9 d-flex align-items-center`}>
                            <h4 className={`fw-bold`}>
                                {currentUser.username}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="tab">
                    <div className={cx("navbar")}>
                        <div className={cx("navbar_container")}>
                            {/* {LIST_NAVBAR.map((nav) => {
                                return (
                                    <NavLink key={nav.id} className={cx("navbar_item")} to={nav.url}>
                                        {({ isActive }) => {
                                            return ((
                                                <>
                                                    <span className={cx("", { title_active: isActive })}>{nav.title}</span>
                                                    <div className={cx("", { underline: isActive })}></div>
                                                </>
                                            ))
                                        }}
                                    </NavLink>
                                )
                            })} */}

                            {LIST_NAVBAR.map((nav) => {
                                return (
                                    <Link to={`/account${nav.url}/${username}`} key={nav.id} className={cx("navbar_item")}>
                                    {/* <div key={nav.id} className={cx("navbar_item")} onClick={() => setContent(nav)}> */}
                                        <span className={cx("", { title_active: nav.id == content.id })}>{nav.title}</span>
                                        <div className={cx("", { underline: nav.id == content.id })}></div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>



                <div>
                    {content.component ? <content.component username={currentUser.username} showTime={true} type="ACCOUNT" setIsLoading={setIsLoading}/> : null}
                </div>


            </div>
            {/* <!-- / Content --> */}
        </>
    )
};