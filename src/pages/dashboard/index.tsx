import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import BoxAccount from "~/components/BoxAccount/Index";
import BoxCredit from "~/components/BoxCredit/Index";
import Loading from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess } from "~/utils/common";



export default function Dashboard() {
    const userData = useAppSelector(inforUser);
    console.log(userData);
    const [isLoading, setIsLoading] = useState(false);
    const [recentCredit, setRecentCredit] = useState([]);
    const [topCredit, setTopCredit] = useState([]);
    const [topAccount, setTopAccount] = useState([]);

    useEffect(() => {
        if (userData?.token) {
            getRecentCredit();
            getTopCredit();
            getTopAccount();
        }
    }, [userData?.token])

    const getRecentCredit = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Credit/get-list-credit-by-user", 
            {
                pageSize: 3,
                pageIndex: 0,
                searchText: "",
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                console.log(res);
                let listCredit = res?.returnObj?.listResult;
                console.log(listCredit);
                setRecentCredit(listCredit);
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

    const getTopCredit = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Credit/get-list-credit-by-filter", 
            {
                pageSize: 3,
                pageIndex: 0,
                searchText: ""
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                console.log(res);
                let listCredit = res?.returnObj?.listResult;
                console.log(listCredit);
                setTopCredit(listCredit);
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

    const getTopAccount = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Account/get-list-account-by-filter", 
            {
                pageSize: 3,
                pageIndex: 0,
                searchText: ""
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listAccount = res?.returnObj?.listResult;
                setTopAccount(listAccount);
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

    return (
        <> 
            <Loading isLoading={isLoading}/>
            <ToastContainer />
            {/* <!-- Content --> */}
            <div className="container-xxl flex-grow-1 container-p-y">

                {/* Gần đây */}
                {/* <h4>Gần đây</h4> */}
                <div className="divider text-start mb-3">
                    <div className="divider-text fs-5 fw-semibold">Gần đây</div>
                </div>

                <div className="row mb-5">
                    {recentCredit.map((credit: ICredit) => (
                        <BoxCredit 
                            key={credit.creditId} 
                            credit={credit}
                            // creditId={""} 
                            // name={""} 
                            // countFlashcard={0} 
                            // avatar={""} 
                            // createdBy={""} 
                        />
                    ))}
                    {/* <BoxCredit />
                    <BoxCredit /> */}
                </div>

                {/* Bộ thẻ phổ biến */}
                {/* <h4>Bộ thẻ phổ biến</h4> */}
                <div className="divider text-start mb-3">
                    <div className="divider-text fs-5 fw-semibold">Bộ thẻ phổ biến</div>
                </div>
                <div className="row mb-5">
                    {topCredit.map((credit: any) => (
                        <BoxCredit key={credit.creditId} credit={credit}/>
                    ))}
                    {/* <BoxCredit />
                    <BoxCredit />
                    <BoxCredit /> */}
                </div>

                {/* Tác giả hàng đầu */}
                {/* <h4>Tác giả hàng đầu</h4> */}
                <div className="divider text-start mb-3">
                    <div className="divider-text fs-5 fw-semibold">Tác giả hàng đầu</div>
                </div>
                <div className="row mb-5">
                    {topAccount.map((account:any) => (
                        <BoxAccount key={account.username} account={account}/>
                    ))}
                    {/* <BoxAccount />
                    <BoxAccount />
                    <BoxAccount /> */}
                </div>

                {/* <!-- Layout Demo --> */}
                {/* <div className="layout-demo-wrapper">
                    <div className="layout-demo-placeholder">
                        <img
                            src="../assets/img/layouts/layout-without-menu-light.png"
                            className="img-fluid"
                            alt="Layout without menu"
                            data-app-light-img="layouts/layout-without-menu-light.png"
                            data-app-dark-img="layouts/layout-without-menu-dark.png"
                        />
                    </div>
                    <div className="layout-demo-info">
                        <h4>Layout without Menu (Navigation)</h4>
                        <button className="btn btn-primary" type="button" >
                            Go Back
                        </button>
                    </div>
                </div> */}
                {/* <!--/ Layout Demo --> */}
            </div>
            {/* <!-- / Content --> */}
        </>
    )
};