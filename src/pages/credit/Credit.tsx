import CanvasJSReact from "@canvasjs/react-charts";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ReactFlipCard from 'reactjs-flip-card';
import Loading, { PopupMenu } from "~/components/Loading/Index";
import styles from "~/pages/credit/Credit.module.scss";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { BASE_URL_MEDIA, Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage, findNotifDate } from "~/utils/common";

// import required modules
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from '@mui/material/MenuItem';
import Tooltip from "@mui/material/Tooltip";
import 'animate.css';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import ListCard from "~/components/Credit/Detail";
import { IFlashcard } from "~/types/IFlash";
import NotFound from "../notfound/NotFound";

var CanvasJSChart = CanvasJSReact.CanvasJSChart

const LIST_LEARN_BTN = [
    {
        name: "Thẻ ghi nhớ",
        icon: "bx bxs-collection",
        link: null,
        active: true
    },
    {
        name: "Luyện tập",
        icon: "bx bxs-book-reader",
        link: '/learn',
        active: false
    },
    {
        name: "Kiểm tra",
        icon: "bx bxs-edit-alt",
        link: '/exam',
        active: false
    },
    {
        name: "Ghép thẻ",
        icon: "bx bxs-extension",
        link: '/match',
        active: false
    },
]

const MEMORY = [
    'Trí nhớ 1 ngày',
    'Trí nhớ 1 tuần',
    'Trí nhớ 1 tháng',
  ];

export default function Credit() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);
    const creditId = GetIdFromCurrentPage();
    const [credit, setCredit] = useState<ICredit|null>(null);
    const [isLearned, setIsLearned] = useState(false);
    const [listFlashcard, setListFlashcard] = useState<IFlashcard[]>([]);
    const [listFlashcardLearn, setListFlashcardLearn] = useState<IFlashcard[]>([]);
    const [currentCard, setCurrentCard] = useState<IFlashcard|null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [dataOvalChart, setDataOvalChart] = useState<any>([]);
    const [showChart, setShowChart] = useState<boolean>(false);
    const [totalInfo, setTotalInfo] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (creditId) {
            getStartupData();
        }
        // handleSetDataChart();
    }, [creditId]);

    const getStartupData = async () => {
        setIsLoading(true);

        await Promise.all([
            getInfoCredit(),
            getListFlashcard(),
            getListFlashcardLearned(),
        ]).then((response: any) => {
            // if (isEditMode) saveDataEdit(response[0], response[1], response[2], response[3]);

            let listCardLearn = response[1];
            if (response[2]?.length > 0) {
                listCardLearn = response[2];
            }
            setListFlashcard(response[1]);
            setListFlashcardLearn(listCardLearn);
            setCurrentCard(listCardLearn[0]);
            setCurrentIndex(0)
        });

        setIsLoading(false);
    }

    const getInfoCredit = () => {
        Post(
            "/api/Credit/get-credit-by-id", 
            creditId, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let credit = res?.returnObj;
                if (credit) {
                    setCredit(credit);
                    setIsLearned(credit.isLearned);
                }
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
    }; 

    const getListFlashcard = async () => {
        let listFlashcards:IFlashcard[] = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0,
                username: userData?.username,
                containerId: creditId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let flashcards = res?.returnObj;
                if (flashcards) {
                    listFlashcards = flashcards;
                    // setListFlashcard(flashcards);
                    // setCurrentCard(flashcards[0]);
                    // setCurrentIndex(0)
                }
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        return listFlashcards;
    }; 

    const getListFlashcardLearned = async () => {
        let listCardLearned:IFlashcard[] = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid-learned", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0,
                username: userData?.username,
                containerId: creditId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let flashcards = res?.returnObj;
                if (flashcards) {
                    listCardLearned = flashcards
                    // setListFlashcard(flashcards);
                    // setCurrentCard(flashcards[0]);
                    // setCurrentIndex(0)
                }
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })

        return listCardLearned;
    }; 

    const handleLearn = async (learned:boolean) => {
        // call api cập nhật trạng thái thẻ: 
        //...
        let data = [];
        data.push({
            flashcardId: currentCard?.flashcardId,
            hasKnown: learned,
            typeLearn: "CARD"
        });

        await Post(
            "/api/Flashcard/learn-flashcard", 
            data, 
            // userData?.token ?? ""
        ).then( async (res) => {
            if(CheckResponseSuccess(res)) {
                let id = document.getElementById('flip_card');
                Swal.fire({
                    icon: learned ? "success" : "error",
                    title: learned ? "Đã biết" : "Đang học",
                    showConfirmButton: false,
                    timer: 600,
                    target: id,
                    customClass: {
                        'container': styles.trial_swal_container,
                        // 'popup': styles.trial_swal_popup
                    },
                    showClass: {
                        popup: `
                        animate__animated
                        animate__faster
                        fadeIn
                        `
                    },
                    hideClass: {
                        popup: `
                        animate__animated
                        animate__faster
                        ${learned ? "animate__backOutRight" : "animate__backOutLeft"}
                        `
                    }
                });
                // next thẻ tiếp theo 
                if (currentIndex + 1 < listFlashcardLearn?.length) {
                    setCurrentCard(listFlashcardLearn?.[currentIndex + 1]);
                    setCurrentIndex(currentIndex + 1);
                    // setIsFront(true);
                }
                // nếu đã hết thẻ 
                else {
                    // call api để Show chart và bước tiếp theo
                    let listFlashcard = await getListFlashcard();
                    setListFlashcard(listFlashcard);
                    
                    // let dataChard = [
                    //     {
                    //         y: listFlashcard?.filter((card:IFlashcard) => card.learns?.[0].process == '0')?.length,
                    //         label: 'Chưa học'
                    //     },
                    //     {
                    //         y: listFlashcard?.filter((card:IFlashcard) => card.learns?.[0].process == '1')?.length,
                    //         label: 'Đang học'
                    //     },
                    //     {
                    //         y: listFlashcard?.filter((card:IFlashcard) => card.learns?.[0].process == '2')?.length,
                    //         label: 'Đã biết'
                    //     },
                    //     {
                    //         y: listFlashcard?.filter((card:IFlashcard) => card.learns?.[0].process == '1')?.length,
                    //         label: 'Thành thạo'
                    //     },
                    // ];
                    // setDataOvalChart(dataChard);
                    // setShowChart(true);

                    handleSetDataChart(listFlashcard);
                }
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

    const handleLearnAll = () => {
        setListFlashcardLearn(listFlashcard);
        setShowChart(false);
        setCurrentIndex(0);
        setCurrentCard(listFlashcard[0])
    }

    const handleSetDataChart = (listCard:IFlashcard[]) => {
        let dataChard = [
            {
                y: Number(((listCard?.filter((card:IFlashcard) => card.learns?.[0].process == '0')?.length / listCard?.length)*100).toFixed(2)) ?? 0,
                x: 'Chưa học'
            },
            {
                y: Number(((listCard?.filter((card:IFlashcard) => card.learns?.[0].process == '1')?.length / listCard?.length)*100).toFixed(2)) ?? 0,
                x: 'Đang học'
            },
            {
                y: Number(((listCard?.filter((card:IFlashcard) => card.learns?.[0].process == '2')?.length / listCard?.length)*100).toFixed(2)) ?? 0,
                x: 'Đã biết'
            },
            {
                y: Number(((listCard?.filter((card:IFlashcard) => card.learns?.[0].process == '3')?.length / listCard?.length)*100).toFixed(2)) ?? 0,
                x: 'Thành thạo'
            },
        ];
        let sumary = dataChard[1];
        if(dataChard[2].y > 0) sumary = dataChard[2];
        if(dataChard[3].y > 0) sumary = dataChard[3];
        
        setTotalInfo(sumary.y + '% ' + sumary.x);
        dataChard = dataChard.filter(item => item.y > 0)
        setDataOvalChart(dataChard);
        setShowChart(true);

    }

    const handleStartLearn = async () => {
        setIsLoading(true);
        await Post(
            "/api/Credit/start-learn-credit", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0,
                username: userData?.username,
                containerId: creditId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let flashcards = res?.returnObj;
                setListFlashcardLearn(flashcards)
                setIsLearned(true);
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
    }

    const handleDelete = async () => {
        Swal.fire({
            title: "Bạn chắc chắn xóa bộ thẻ này?",
            text: "Hành động này sẽ không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Tiếp tục"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // call api delete
                // setIsLoading(true);
                await Post(
                    "/api/Credit/delete-credit",
                    {
                        creditId: credit?.creditId
                    },
                ).then((res) => {
                    if (CheckResponseSuccess(res)) {
                        // setIsLoading(false);
                        Swal.fire({
                            title: "Đã xóa thành công!",
                            icon: "success",
                            timer: 700,
                        });
                        navigate(-1)
                    }
                    else {
                        toast.error("Đã có lỗi xảy ra.");
                    }
                })
                .catch((err) => {
                    toast.error("Đã có lỗi xảy ra.");
                    console.log(err);
                })
                // setIsLoading(false);
            }
        });
    }

    const handleCopyCredit = async () => {
        setIsLoading(true);
        await Post(
            "/api/Credit/copy-credit",
            {
                creditId: credit?.creditId
            },
        ).then((res) => {
            if (CheckResponseSuccess(res) && res.returnObj != null) {
                // setIsLoading(false);
                Swal.fire({
                    title: "Đã copy thành công!",
                    icon: "success",
                    timer: 700,
                });
                navigate('/credit/' + res.returnObj);
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
    }

    const handleSpeak = (text:string) => {
        let utterance = new SpeechSynthesisUtterance(text);

        speechSynthesis.speak(utterance);
    }

    const Card = (props:{isFront:boolean, flashcard:IFlashcard|null}) => {
        return (
            <>
                <div className={`card ${styles.box_padding} ${styles.flashcard_box}`}>
                    {props.isFront ? <div className={styles.audio_btn}>
                        <button onClick={(e) => {e.stopPropagation(); handleSpeak(props?.flashcard?.question ?? '')}} type="button" className="btn rounded-pill btn-icon ">
                            <span className="bx bx-volume-full"></span>
                            {/* <span className="bx bx-volume-mute"></span> */}
                        </button>
                    </div>: null}
                    <div className={styles.content}>
                        {props.isFront ? props.flashcard?.question : props.flashcard?.answer}
                    </div>
                    {(!props.isFront && props.flashcard?.image)?
                        <div className={styles.image}>
                            <img className={styles.img} src={`${BASE_URL_MEDIA}/${props.flashcard?.image}`} alt="Card image" />
                        </div>
                    :null}
                </div>
            </>
        )
    }

    const optionsChart = {
        // exportEnabled: true,
        animationEnabled: true,
        theme: "light1",  
        creditText: "",
        creditHref: "",
        // legend: {
        //     horizontalAlign: "right", // "center" , "right"
        //     verticalAlign: "center",  // "top" , "bottom"
        //     fontSize: 15,
        //     itemWidth: 250,
        //     dockInsidePlotArea: true 
        // },
        backgroundColor: 'transparent',
        subtitles: [{
            text: totalInfo,
            verticalAlign: "center",
            fontSize: 15,
            fontWeight: "bold",
            fontFamily: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            dockInsidePlotArea: true
        }],
        width: 220,
        height: 220,
        data: [{
            type: "doughnut",
            // startAngle: 75,
            toolTipContent: "<b>{x}</b>: {y}%",
            // showInLegend: "true",
            // legendText: "{label}",
            // indexLabelFontSize: 16,
            // indexLabel: "{label} - {y}%",
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

    

    if (!credit) {
        return (
            <>
                {isLoading ? null : <NotFound />}
                <Loading isLoading={isLoading}/>
                <ToastContainer />
            </>
        )
    }

    return (<>
        
        <Loading isLoading={isLoading}/>
        <ToastContainer />
        <div className={`container-xxl flex-grow-1 container-p-y ${styles.container}`}>
            <h2 className="fw-bold">{credit?.name}</h2>

            {isLearned ? 
            <>
                {/* Btn chức năng học */}
                <div className={`${styles.learn_btn}`}>
                    {LIST_LEARN_BTN.map((item) => (
                        <div key={item.name} className={` col-md-3 col-lg-3 col-6 col-sm-6 my-1 `}>
                            <div onClick={() => {item.link ? navigate(`${item.link}/${credit.creditId}`) : null}} className={`card mx-2 ${styles.box_padding} hoverable cursor-pointer ${item.active ? "border-active" : ""}`}>
                                <h5 className={`my-1 ${styles.title}`}>
                                    <i className={`fs-3 ${item.icon} ${styles.learn_icon}`}></i>
                                    {item.name}
                                </h5>
                            </div>
                        </div>
                    ))}
                </div>


                <div id="flip_card" className={styles.flip_card}>
                    {!showChart ? 
                        listFlashcardLearn?.map((card:IFlashcard) => {
                            return (
                                <ReactFlipCard
                                    key={card.flashcardId}
                                    // frontStyle={style.card}
                                    // backStyle={style.card}
                                    // containerStyle={{position: 'absolute'}}
                                    containerCss={`${styles.flashcard} ${card.flashcardId != currentCard?.flashcardId ? styles.disable : "x"}`}
                                    onClick={() => {handleSpeak(currentCard?.question ?? "")}}
                                    direction='vertical'
                                    flipTrigger="onClick"
                                    frontComponent={<Card isFront = {true} flashcard={currentCard}/>}
                                    backComponent={<Card isFront = {false} flashcard={currentCard}/>}
                                />
                            )
                        })
                    : 
                        <div className={`${styles.flashcard} my-5`}>
                            <div className="title row align-items-center">
                                <h2 className="col-9">Bạn đang làm rất tốt !</h2>
                                <img className="col-2 rotate-270" src='/src/assets/img/icons/confetti_icon.png' />
                            </div>
                            <div className="content row">
                                <div className="col-6">
                                    <h4 className="fw-bold">Tiến độ của bạn</h4>
                                    <CanvasJSChart options = {optionsChart}
                                        /* onRef={ref => this.chart = ref} */
                                    />
                                </div>
                                <div className="col-6">
                                    <h4 className="fw-bold">Bước tiếp theo</h4>
                                    <div className={styles.next_process}>
                                        <div onClick={() => navigate(`/exam/${credit.creditId}`)} className={`card hstack mx-1 my-3 row hoverable cursor-pointer`}>
                                            <div className={`col-2 `}>
                                                <i className={`bx bxs-edit-alt ${styles.icon}`}></i>
                                            </div>
                                            <div className={`col-10 ${styles.content}`}>
                                                <h5 className={styles.title}>
                                                    Kiểm tra
                                                </h5>
                                                <p className={styles.descrip}>Làm bài kiểm tra cho bộ thẻ này</p>
                                            </div>
                                        </div>

                                        <div onClick={() => navigate(`/learn/${credit.creditId}`)} className={`card hstack mx-1 my-3 row hoverable cursor-pointer`}>
                                            <div className={`col-2 `}>
                                                <i className={`bx bxs-book-reader ${styles.icon}`}></i>
                                            </div>
                                            <div className={`col-10 ${styles.content}`}>
                                                <h5 className={styles.title}>
                                                    Đến phần luyện tập
                                                </h5>
                                                <p className={styles.descrip}>Ôn lại các thẻ bằng phương pháp "Luyện tập"</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={handleLearnAll} className={styles.process_link}>
                                        <i className='bx bx-arrow-back'></i>
                                        <span>Xem lại toàn bộ thẻ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                {showChart ? null :
                    <div className={`${styles.bottom}`}>
                            
                        
                        <div className={`${styles.flashcard_info}`}>
                            <div></div>

                            <div className={`${styles.paging}`}>
                                <Tooltip title="Đang học" placement="top" arrow>
                                    {/* <Button>Arrow</Button> */}
                                    <button onClick={() => handleLearn(false)} className={`${styles.btn}`} type="button" >
                                        <span className="bx bx-x"></span>
                                    </button>
                                </Tooltip>
                                <span className={`${styles.page}`}> {currentIndex + 1} / {listFlashcardLearn.length} </span>
                                <Tooltip title="Đã biết" placement="top" arrow>
                                    <button onClick={() => handleLearn(true)} className={`${styles.btn}`} type="button" >
                                        <span className="bx bx-check"></span>
                                    </button>
                                </Tooltip>
                            </div>

                            <div className={`${styles.setting}`}>
                                <button type="button" className="btn rounded-pill btn-icon">
                                    <span className="bx bx-cog"></span>
                                </button>
                            </div>
                        </div>
                        <LinearProgress className={`${styles.progress}`} variant="determinate" value={((currentIndex)/listFlashcardLearn?.length) * 100} />
                        
                        {/* <SimpleListMenu memories={MEMORY}/> */}
                    </div>
                }
            </> : null} 

            <div className={styles.author}>
                <Link to={`/account/${credit?.createdBy}`}>
                    <div className="d-flex">
                        <div className="me-3">
                            <div className="avatar">
                                <img src={BASE_URL_MEDIA + '/' + credit?.avatar} className="w-px-40 h-px-40 rounded-circle" />
                            </div>
                        </div>
                        <div className="">
                            <span className={`${styles.info} fw-semibold d-block`}>{credit?.createdBy}</span>
                            <small className="text-muted">Đã tạo {findNotifDate(credit?.createdAt)}</small>
                        </div>
                    </div>
                </Link>

                {isLearned ? 
                <div className={styles.btn}>
                    <Tooltip title="Chia sẻ" placement="top" arrow>
                        <span className='bx bxs-share-alt' onClick={() => {navigator.clipboard.writeText(window?.location?.toString()); toast.success('Đã sao chép vào bảng nhớ tạm')}}></span>
                    </Tooltip>
                    {userData?.username == credit.createdBy ? <Tooltip title="Chỉnh sửa" placement="top" arrow>
                        <span className='bx bxs-pencil' onClick={() => navigate(`/create-credit/${credit.creditId}`)}></span>
                    </Tooltip> : null}
                    {/* <Tooltip title="Xóa, Sao chép, ..." placement="top" arrow> */}
                        <PopupMenu 
                            renderBtn={(handleClick:any) => (
                                <span id="demo-positioned-button" onClick={handleClick} className='bx bx-dots-horizontal-rounded'></span>
                            )}
                            renderItem={(handleClose:any) => (
                                <div>
                                    {userData?.username == credit.createdBy ? <MenuItem onClick={() => {handleClose(); handleDelete();}} className="menu_item">
                                        <span className='bx bx-trash icon'></span>
                                        Xóa bộ thẻ 
                                    </MenuItem> : 
                                    <>
                                        <MenuItem className="menu_item" onClick={() => handleCopyCredit()}>
                                            <span className='bx bx-copy-alt icon'></span>
                                            Tạo bản sao
                                        </MenuItem>
                                        <MenuItem onClick={() => (console.log())} className="menu_item">
                                            <span className='bx bx-message-square-error icon'></span>
                                            Báo cáo bộ thẻ 
                                        </MenuItem>
                                    </>}
                                </div>
                            )}
                        />
                        
                    {/* </Tooltip> */}
                </div> : 
                <div className={styles.learn_btn}>
                    <button type="button" className="btn btn-primary" onClick={() => handleStartLearn()}>Học bộ thẻ này</button>
                </div>
                }

            </div>

            <div className={styles.detail}>
                <div className={styles.title}>Thuật ngữ trong bộ thẻ này ({listFlashcard.length}) </div>
            
                <ListCard flashcards = {listFlashcard} isLearned={isLearned}/>
            </div>

        </div>
    </>)
};
