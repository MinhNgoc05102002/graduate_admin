import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { CheckResponseSuccess } from "~/utils/common";
import styles from "../../pages/account/Account.module.scss";
import Loading from "../Loading/Index";
import { IClass } from "~/types/IClass";
import BoxClassAccount from "./Box/BoxClassAccount";

// truyền username của user đang đăng nhập vào đây
export default function ListClass(props:any) {
    const {username} = props;

    const userData = useAppSelector(inforUser);
    const [listClass, setListClass] = useState<IClass[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);

    useEffect(() => {
        if (userData?.token) {
            getRecentCredit();
        }
    }, [userData?.token, username, pageIndex])

    // useEffect(() => {
    //     getRecentCredit();
    // }, [pageIndex])

    const getRecentCredit = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Class/get-class-by-username", 
            {
                pageSize: 5,
                pageIndex: pageIndex,
                searchText: search,
                username: username
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listClass = res?.returnObj?.listResult;
                setListClass(listClass);
                setToTalPage(res?.returnObj?.totalPage)
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

    const handleNextPage = (index:number) => {
        let newPageIndex = pageIndex + index;
        if (newPageIndex >= 1 && newPageIndex <= totalPage) {
            setPageIndex(newPageIndex);
        }
    }

    const handleSearch = (e:any = null) => {
        setPageIndex(1)
        e?.preventDefault();
        getRecentCredit()
    }

    return (
        <>
            <Loading isLoading={isLoading}/>
            <ToastContainer />

            <div className={` ${styles.search_container} d-flex justify-content-between row g-0 mb-5`}>
                <div className="combobox col-8">
                    {/* combobox ... */}
                </div>

                <div className={`d-flex col-4 align-items-center ${styles.box_search}`}>
                    <i className="bx bx-search fs-4 lh-0"></i>
                    <form onSubmit={(e) => handleSearch(e)}>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={(e) => handleSearch()}
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Tìm kiếm..."
                            aria-label="Tìm kiếm..."
                        />
                    </form>
                </div>
            </div>

            {listClass.map((item, index) => {
                // let lastTime = index > 0 ? showDate(listClass[index-1].createdAt) : ''
                // let time = showDate(item.createdAt)

                return (
                <div key={item.classId}>
                    {/* {lastTime != time ? 
                        <div className="divider text-start mb-3 mt-5">
                            <div className="divider-text fs-5">{time}</div>
                        </div>
                    : null} */}

                    <BoxClassAccount class={item} />
                </div>)
            })}
            
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
        </>)
};
