import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";
import styles from "./ClassComp.module.scss";
import Loading from "../Loading/Index";
import { IClass } from "~/types/IClass";
import BoxAccount from "./BoxAccount";

// truyền username của user đang đăng nhập vào đây
export default function ListMember(props:any) {
    const {username, setIsLoading} = props;

    const userData = useAppSelector(inforUser);
    const [listAccount, setListAccount] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);

    useEffect(() => {
        if (userData?.token) {
            getRecentCredit();
        }
    }, [userData?.token, username, pageIndex])

    const getRecentCredit = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        let containerId = GetIdFromCurrentPage();
        await Post(
            "/api/Account/get-account-join-class", 
            {
                pageSize: 10,
                pageIndex: pageIndex,
                searchText: search,
                // username: username,
                containerId: containerId
            }, 
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listAccount = res?.returnObj?.listResult;
                setListAccount(listAccount);
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

            <div className="row mb-5">
                {listAccount.map((account:any) => (
                    <BoxAccount key={account.username} account={account}/>
                ))}
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

        </>)
};
