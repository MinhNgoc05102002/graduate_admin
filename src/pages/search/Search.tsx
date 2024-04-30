import { useEffect, useState } from "react";
import styles from "./Search.module.scss";
import classNames from "classnames/bind";
import ListCredit from "~/components/Account/ListCredit";
import { CheckResponseSuccess, GetIdFromCurrentPage, GetPreIdFromCurrentPage } from "~/utils/common";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import NotFound from "../notfound/NotFound";
import Loading from "~/components/Loading/Index";
import ListFolder from "~/components/Account/ListFolder";
import ListClass from "~/components/Account/ListClass";
import Maintain from "../maintain/Maintain";
import { ICredit } from "~/types/ICredit";
import BoxCredit from "~/components/BoxCredit/Index";
import { SignalWifiStatusbarNullRounded } from "@mui/icons-material";
import BoxAccount from "~/components/BoxAccount/Index";
import BoxClassAccount from "~/components/Account/Box/BoxClassAccount";

const cx = classNames.bind(styles);

const LIST_NAVBAR = [
    {
        id: "CREDIT",
        title: "Bộ thẻ",
        api: '/api/Credit/get-list-credit-by-filter'
    },
    {
        id: "ACCOUNT",
        title: "Tài khoản",
        api: '/api/Account/get-list-account-by-filter'
    },
    {
        id: "CLASS",
        title: "Lớp học",
        api: '/api/Class/get-list-class-by-filter'
    },
];

export default function Search() {
    const [content, setContent] = useState<any>(LIST_NAVBAR[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser|null>(null);
    const userData = useAppSelector(inforUser);
    const username = GetIdFromCurrentPage();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const params= useParams();
    const searchParam = params.searchText;

    useEffect(() => {
        setSearchText(searchParam ?? '');
    }, [searchParam])

    return (
        <>
            <Loading isLoading={isLoading}/>
            <ToastContainer />
            {/* <!-- Content --> */}
            <div className="container-xxl flex-grow-1 container-p-y">

                <div className="header">
                    <div className="row g-0">
                        {/* Username */}
                        <div className={`col-md-11 col-lg-11 col-sm-10 col-9 d-flex align-items-center`}>
                            <h4 className={`fw-bold`}>
                                {searchText ? `Kết quả cho "${searchText}"` : "Hãy nhập thông tin để tìm kiếm"}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="tab">
                    <div className={cx("navbar")}>
                        <div className={cx("navbar_container")}>

                            {LIST_NAVBAR.map((nav) => {
                                return (
                                    // <Link to={`/account${nav.url}/${username}`} key={nav.id} className={cx("navbar_item")}>
                                    <div key={nav.id} className={cx("navbar_item")} onClick={() => setContent(nav)}>
                                        <span className={cx("", { title_active: nav.id == content.id })}>{nav.title}</span>
                                        <div className={cx("", { underline: nav.id == content.id })}></div>
                                    {/* </Link> */}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>



                <div>
                    <ListResultSearch searchText={searchText} type={content.id} api={content.api}/>
                </div>


            </div>
            {/* <!-- / Content --> */}
        </>
    )
};


function ListResultSearch(props:{searchText:string|undefined, type: string, api:string}) {
    const {searchText, type, api} = props;
    const [listData, setListData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);

    useEffect(() => {
        if (searchText) {
            fetchApiSearch();
        }
    }, [searchText, pageIndex, type, api]);

    useEffect(() => {
        setPageIndex(1)
    }, [searchText, type, api])

    const handleNextPage = (index:number) => {
        let newPageIndex = pageIndex + index;
        if (newPageIndex >= 1 && newPageIndex <= totalPage) {
            setPageIndex(newPageIndex);
        }
    }

    const fetchApiSearch = () => {
        Post(
            api, 
            {
                pageSize: 9,
                pageIndex: pageIndex,
                searchText: searchText
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listCredit = res?.returnObj?.listResult;
                setListData(listCredit);
                setToTalPage(res?.returnObj?.totalPage);
                
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
    }

    return (
        <>
            <div className="row mb-5 mt-5">
                {type == "CREDIT" ? listData.map((credit: ICredit) => (
                    <BoxCredit 
                        // key={credit.creditId} 
                        key={Math.random()}
                        credit={credit}
                    />
                )) : null}

                {type == "ACCOUNT" ? listData.map((account: any) => (
                    <BoxAccount key={Math.random()} account={account}/>
                )) : null}

                {type == "CLASS" ? listData.map((clas: any) => (
                    <div key={Math.random()}  className="col-md-4">
                        <BoxClassAccount class={clas} />
                    </div>
                )) : null}
            </div>
            
            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">
                <li className="page-item prev">
                    <a onClick={() => handleNextPage(-1)} className={`page-link fw-semibold ${styles.arrow} ${pageIndex > 1 ? styles.active : null}`}>
                        <i className="tf-icon bx bx-chevron-left"></i>
                        <span>Trước</span>
                    </a>
                </li>
                {/* <li className="page-item active">
                    <a className="page-link">Trang 2 / 3</a>
                </li> */}
                <li className="page-item">
                    <a className={`page-link fw-semibold ${styles.page_size} `}>
                        Trang {pageIndex} / {totalPage}
                    </a>
                </li>
                <li className="page-item next">
                    <a onClick={() => handleNextPage(1)} className={`page-link fw-semibold ${styles.arrow} ${pageIndex < totalPage ? styles.active : null}`}>
                        <span>Tiếp</span>
                        <i className="tf-icon bx bx-chevron-right"></i>
                    </a>
                </li>
                </ul>
            </nav>
        </>
    )
}