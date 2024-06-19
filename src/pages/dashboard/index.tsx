import CanvasJSReact from '@canvasjs/react-charts';
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
import styles from './Dashboard.module.scss'

var CanvasJSChart = CanvasJSReact.CanvasJSChart

export default function Dashboard() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState<any>({});
    const [dataOvalChart, setDataOvalChart] = useState<any>([]);
    const [dataSplineChart, setDataSplineChart] = useState<any>([]);

    useEffect(() => {
        if (userData?.token) {
            getAdminOverview();
        }
    }, [userData?.token])

    const getAdminOverview = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Account/get-overview", 
            null, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let resData = res.returnObj;

                console.log(res);

                let listAccChart = resData.newAccountByDate.map((item:any) => ({
                    x: new Date(item.label),
                    y: item.value
                }));
                let listCreditChart = resData.newCreditByDate.map((item:any) => ({
                    x: new Date(item.label),
                    y: item.value
                }));
                let listClassChart = resData.newClassByDate.map((item:any) => ({
                    x: new Date(item.label),
                    y: item.value
                }));

                setData({
                    numNewAccount: resData.numNewAccount,
                    numNewCredit: resData.numNewCredit,
                    numNewClass: resData.numNewClass,
                    numNewReport: resData.numNewReport
                });

                setDataSplineChart({
                    newCreditByDate: listCreditChart, 
                    newClassByDate: listClassChart,
                    newAccountByDate: listAccChart
                });

                let total = resData.creditByCategory.reduce(((res:any, item:any) => res + item.value), 0);

                let dataOval = resData.creditByCategory.filter((item:any) => item.value > 0).map((item:any) => {
                    return {
                        y: ((item.value/total)*100).toFixed(1),
                        label: item.label
                    }
                });

                setDataOvalChart(dataOval)
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

    const optionsChart = {
        exportEnabled: true,
        animationEnabled: true,
        theme: "light1",  
        creditText: "",
        creditHref: "",
        legend: {
            horizontalAlign: "right", // "center" , "right"
            verticalAlign: "center",  // "top" , "bottom"
            fontSize: 15,
            itemWidth: 250,
            dockInsidePlotArea: true 
        },
        // backgroundColor: 'transparent',
        // subtitles: [{
        //     text: 'hêhê',
        //     verticalAlign: "center",
        //     fontSize: 15,
        //     fontWeight: "bold",
        //     fontFamily: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        //     dockInsidePlotArea: true
        // }],
        // width: 220,
        // height: 220,
        data: [{
            // type: "doughnut",
            type: "pie",
            startAngle: 90,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: dataOvalChart
            // [
            //     { y: 18, label: "Direct" },
            //     { y: 49, label: "Organic Search" },
            //     { y: 9, label: "Paid Search" },
            //     { y: 5, label: "Referral" },
            //     { y: 19, label: "Social" }
            // ]
        }]
    }

    const optionsByDate = {
        animationEnabled: true,
        exportEnabled: true,
        creditText: "",
        creditHref: "",
        axisY: {
            title: "Số lượng",
            suffix: " "
        },
        axisX: {
            valueFormatString: "MM/YYYY",
            interval: 1,
            intervalType: "month"
          },
        data: [{
            type: "splineArea",
            xValueFormatString: "MM/YYYY",
            // yValueFormatString: "#,##0.## bn kW⋅h",
            showInLegend: true,
            legendText: "Lượng người dùng mới",
            dataPoints: dataSplineChart.newAccountByDate
            // [
            //     { x: new Date(2008, 0), y: 70.735 },
            //     { x: new Date(2009, 0), y: 74.102 },
            //     { x: new Date(2010, 0), y: 72.569 },
            //     { x: new Date(2011, 0), y: 72.743 },
            //     { x: new Date(2012, 0), y: 72.381 },
            //     { x: new Date(2013, 0), y: 71.406 },
            //     { x: new Date(2014, 0), y: 73.163 },
            // ]
        },
        {
            type: "splineArea",
            xValueFormatString: "MM/YYYY",
            // yValueFormatString: "#,##0.## bn kW⋅h",
            showInLegend: true,
            legendText: "Lượng lớp học mới",
            dataPoints: dataSplineChart.newClassByDate
            // [
            //     { x: new Date(2008, 0), y: 70.735 },
            //     { x: new Date(2009, 0), y: 74.102 },
            //     { x: new Date(2010, 0), y: 72.569 },
            //     { x: new Date(2011, 0), y: 72.743 },
            //     { x: new Date(2012, 0), y: 72.381 },
            //     { x: new Date(2013, 0), y: 71.406 },
            //     { x: new Date(2014, 0), y: 73.163 },
            // ]
        },
        {
            type: "splineArea",
            xValueFormatString: "MM/YYYY",
            // yValueFormatString: "#,##0.## bn kW⋅h",
            showInLegend: true,
            legendText: "Lượng bộ thẻ mới",
            dataPoints: dataSplineChart.newCreditByDate
            // [
            //     { x: new Date(2008, 0), y: 70.735 },
            //     { x: new Date(2009, 0), y: 74.102 },
            //     { x: new Date(2010, 0), y: 72.569 },
            //     { x: new Date(2011, 0), y: 72.743 },
            //     { x: new Date(2012, 0), y: 72.381 },
            //     { x: new Date(2013, 0), y: 71.406 },
            //     { x: new Date(2014, 0), y: 73.163 },
            // ]
        }
    ]}

    return (
        <> 
            <Loading isLoading={isLoading}/>
            <ToastContainer />
            {/* <!-- Content --> */}
            <div className="container-xxl flex-grow-1 container-p-y">

                {/* Gần đây */}
                {/* <h4>Gần đây</h4> */}
                <div className="divider text-start mb-3">
                    <div className="divider-text fs-5 fw-semibold">Thông số trong tuần</div>
                </div>

                <div className="row mb-5">
                    <div className="col">
                        <div className={styles.item} >
                            <div className={styles.icon}>
                                <span className={`bx bx-user`}></span>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.number}>{data.numNewAccount}</div>
                                <div className={styles.text}>Người dùng mới</div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="col">
                        <div className={styles.item} >
                            <div className={styles.icon}>
                                <span className={`bx bx-collection ${styles.purple}`}></span>
                                {/* <img className={styles.green} src={images.icon.icon_users} alt="" /> */}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.number}>{data.numNewCredit}</div>
                                <div className={styles.text}>Bộ thẻ mới</div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="col">
                        <div className={styles.item} >
                            <div className={styles.icon}>
                                <span className={`bx bx-cube-alt ${styles.blue}`}></span>
                                {/* <img className={styles.green} src={images.icon.icon_users} alt="" /> */}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.number}>{data.numNewClass}</div>
                                <div className={styles.text}>Lớp học mới</div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="col">
                        <div className={styles.item} >
                            <div className={styles.icon}>
                                <span className={`bx bx-error ${styles.yellow}`}></span>
                                {/* <img className={styles.green} src={images.icon.icon_users} alt="" /> */}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.number}>{data.numNewReport}</div>
                                <div className={styles.text}>Lượt báo cáo mới</div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* Bộ thẻ phổ biến */}
                <div className="divider text-start mb-3">
                    <div className="divider-text fs-5 fw-semibold">Tỉ lệ bộ thẻ theo thể loại</div>
                </div>
                <div className="mb-5">
                    <div className={styles.chart_container}>
                        <div className={`card mb-3 p-4`}>
                            <CanvasJSChart 
                                options = {optionsChart} 
                                containerProps={{ width: '100%', height: '300px' }}
                            />
                        </div>
                    </div>

                </div>

                {/* Tác giả hàng đầu */}
                {/* <h4>Tác giả hàng đầu</h4> */}
                <div className="divider text-start mb-3">
                    <div className="divider-text fs-5 fw-semibold">Biểu đồ số lượng bộ thẻ mới theo tháng</div>
                </div>
                <div className="mb-5">
                    <div className={styles.chart_container}>
                        <div className={`card mb-3 p-5`}>
                            <CanvasJSChart containerProps={{ width: '100%', height: '390px' }} options = {optionsByDate}
                            />
                        </div>
                    </div>
                </div>

                
            </div>
            {/* <!-- / Content --> */}
        </>
    )
};