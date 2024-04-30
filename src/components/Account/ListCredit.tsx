import { useEffect, useState } from "react"
import BoxCreditAccount from "./Box/BoxCreditAccount";
import { Post } from "~/services/axios";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import styles from "../../pages/account/Account.module.scss";
import { ICredit } from "~/types/ICredit";

function showDate(date_notified = "2021-11-05 15:00:00") {
    /**
    * @ findNotifDate : Finds the Date Difference of a Notification
    * @ date_notified : The notification date
    **/
    const date_sent_tmp = new Date(date_notified);

    let date_sent:any;
    //Check for timestamps
    if(date_notified.indexOf('-') != -1){
          date_sent = date_sent_tmp.getTime();
    }else{
          date_sent = date_notified;
    }

    const date_now = new Date();
    //current timestamp
    var today = date_now.getTime(); 

    //Subtract the timestamps
    var calc = new Date(today - date_sent);

    //Prevent Extra 1 Hour
    calc.setHours( calc.getUTCHours() +0);

    //Make our result readable
    var calcDate = calc.getDate()+'-'+(calc.getMonth()+1)+'-'+calc.getFullYear();
    var calcTime = calc.getHours()+':'+calc.getMinutes()+':'+calc.getSeconds();

    //Get How many days, months and years that has passed
    var date_passed = calcDate.split("-");
    var time_passed = calcTime.split(":");
    let days_passed;
    let months_passed;
    let years_passed;

     if(!(calcDate.includes('1-1-1970'))) {

         days_passed = ((parseInt(date_passed[0]) - 1) != 0 ) ? 
         parseInt(date_passed[0]) - 1 : null;
         months_passed = ((parseInt(date_passed[1]) - 1) != 0 )? 
         parseInt(date_passed[1]) - 1 : null;
         years_passed =  ((parseInt(date_passed[2]) - 1970) != 0) ?
         parseInt(date_passed[2]) - 1970 : null;
         return `Tháng ${date_sent_tmp.getMonth() + 1} năm ${date_sent_tmp.getFullYear()}`

    }else{
         days_passed = null;
         months_passed = null;
         years_passed =  null;
         return `Gần đây`
    }
}

// truyền username của user đang đăng nhập vào đây
export default function ListCredit(props:any) {
    let {username, showTime, type = "ACCOUNT", setIsLoading, reload, setReload} = props;

    const userData = useAppSelector(inforUser);
    const [listCredit, setListCredit] = useState<ICredit[]>([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);

    useEffect(() => {
        if (userData?.token) {
            getListCredit();
        }
    }, [userData?.token, username, pageIndex])

    useEffect(() => {
        if (reload == true) {
            getListCredit();
            setReload(false);
        }
    }, [reload])

    const getListCredit = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);

        let api = "/api/Credit/get-list-credit-by-user";
        let containerId = null;
        let user = username;

        if (type != "ACCOUNT") {
            api = "/api/Credit/get-list-credit-by-class";
            containerId = GetIdFromCurrentPage();
            user = ""
        }

        await Post(
            api, 
            {
                pageSize: 5,
                pageIndex: pageIndex,
                searchText: search,
                username: user,
                containerId: containerId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listCredit = res?.returnObj?.listResult;
                setListCredit(listCredit);
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
        getListCredit()
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



            {listCredit.map((credit, index) => {
                let lastTime = index > 0 ? showDate(listCredit[index-1].createdAt) : ''
                let time = showDate(credit.createdAt)

                return (
                <div key={credit.creditId}>
                    {(lastTime != time && showTime)? 
                        <div className="divider text-start mb-3 mt-5">
                            <div className="divider-text fs-5">{time}</div>
                        </div>
                    : null}

                    <BoxCreditAccount credit={credit} />
                </div>)
            })}
            
            {listCredit?.length == 0 && type == "CLASS" ? null :
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
            }
        </>)
};
