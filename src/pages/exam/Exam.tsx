import CanvasJSReact from "@canvasjs/react-charts";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading, { PopupMenu } from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage, findNotifDate } from "~/utils/common";
import styles from "./Exam.module.scss";

// import required modules
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from '@mui/material/MenuItem';
import 'animate.css';
import { useNavigate } from "react-router-dom";
import ListCard from "~/components/Credit/Detail";
import { IFlashcard } from "~/types/IFlash";
import NotFound from "../notfound/NotFound";
import Swal from "sweetalert2";
import { BootstrapDialog } from "~/components/Common";
import { Checkbox, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { set } from "lodash";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const QUESTION_TYPE = [
    {
        id: 'MULTIPLE',
        label: 'Trắc nghiệm'
    },
    // {
    //     id: 'TRUE_FALSE',
    //     label: 'Đúng/Sai'
    // },
    {
        id: 'ONE',
        label: 'Tự luận'
    },
    {
        id: 'AUDIO',
        label: 'Chính tả'
    },
]

export default function Exam() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const creditId = GetIdFromCurrentPage();
 
    const [listFlashcardExam, setListFlashcardExam] = useState<IFlashcard[]>([]);
    const [listFlashcardAll, setListFlashcardAll] = useState<IFlashcard[]>([]);
    const [credit, setCredit] = useState<ICredit|null>(null);
    const [pageSize, setPageSize] = useState(10);
    const [maxPageSize, setMaxPageSize] = useState(10);
    const [listQuesType, setListQuesType] = useState([QUESTION_TYPE[0], QUESTION_TYPE[1], QUESTION_TYPE[2]])
    const [showResult, setShowResult] = useState(false);
    const [dataOvalChart, setDataOvalChart] = useState<any>([]);
    const [totalInfo, setTotalInfo] = useState<string>("");
    const [openModal, setOpenModal] = useState(false);
    const [timeStart, setTimeStart] = useState(Date.now());
    const [timeEnd, setTimeEnd] = useState<string>('');

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
            getListFlashcardExam(),
            getListAllFlashcard(),
        ]).then((response: any) => {
            let listCardLearned = response[1];
            let listAllFlashCard = response[2];

            // handle chia câu hỏi
            handleSetListFlashCardExam(listCardLearned, listAllFlashCard)
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
                    // setIsLearned(credit.isLearned);
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

    const getListFlashcardExam = async (isLearned = false) => {
        let listCardLearned:IFlashcard[] = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid-exam", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: pageSize,
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
                    
                    if (isLearned) {
                        handleSetListFlashCardExam(listCardLearned, listFlashcardAll);
                    }
                    
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

    const handleSetListFlashCardExam = (listCardLearned:IFlashcard[], listAllFlashCard:IFlashcard[]) => {
        let numQuestion = pageSize;
        if (listCardLearned.length < pageSize) {
            numQuestion = listCardLearned.length;
        }

        let numQuestionPerType = Math.floor(numQuestion / listQuesType.length);
        let i = 0;
        let listCardWithQues = listCardLearned?.map((card:IFlashcard, index:any) => {
            if (index >= (numQuestionPerType * (i + 1))) {
                i++;

                if (i >= listQuesType.length) {

                    // tại đây là hết vòng (trường hợp chia lẻ) => thực hiện random
                    let indexTypeQues = Math.floor(Math.random() * listQuesType.length)
                    card.questionType = listQuesType[indexTypeQues];
                    card.listMultipleAns = genListMultipleAns(card, listAllFlashCard);
                    return card;
                }
            }

            card.questionType = listQuesType[i];
            card.listMultipleAns = genListMultipleAns(card, listAllFlashCard);
            return card;
        });

        setListFlashcardExam(listCardWithQues);
    }

    const getListAllFlashcard = async () => {
        let result:IFlashcard[] = [];
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
                    // listFlashcards = flashcards;
                    // setListFlashcard(flashcards);
                    // setCurrentCard(flashcards[0]);
                    // setCurrentIndex(0)
                    setListFlashcardAll(flashcards)
                    setMaxPageSize(flashcards.length);
                    if (flashcards.length < 10) {
                        setPageSize(flashcards.length)
                    }
                    if (flashcards.length > 50) {
                        setMaxPageSize(50);
                    }
                    result = flashcards;
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
        return result;
    }; 

    const handleAnswer = async(answer: string, card:IFlashcard) => {
        card.answerExam = answer;

        listFlashcardExam.map((flashcard) => {
            if (card.flashcardId == flashcard.flashcardId) {
                return card;
            }
            return flashcard;
        });

        setListFlashcardExam(listFlashcardExam);
    }

    const handleShowResult = async () => {
        let data:any = [];
        if (listFlashcardExam.some((item) => item.answerExam == null)) {
            Swal.fire({
                title: "Hãy hoàn thành bài kiểm tra của bạn trước khi nộp",
                icon: "error",
                showConfirmButton: true,
                // timer: 600,
            });
            return 
        }

        let timeEnd = findNotifDate(timeStart.toString(), true);
        setTimeEnd(timeEnd);

        let newListFlashcardExam = listFlashcardExam.map((card) => {

            let learn:any = card?.answer.trim().toLowerCase() == card.answerExam?.trim().toLowerCase() ? true : false;
            // đối với câu hỏi phát âm
            if (card.questionType.id == "AUDIO") {
                
                learn = (card?.question.trim().toLowerCase() == card.answerExam?.trim().toLowerCase()) ? true : false;
            }
            data.push({
                flashcardId: card?.flashcardId,
                hasKnown: learn,
                typeLearn: "EXAM"
            })
            return {
                ...card,
                learn: learn
            }
        });

        setListFlashcardExam(newListFlashcardExam)
        setShowResult(true);
        handleSetDataChart(newListFlashcardExam);
        window.scrollTo(0, 0);

        // call api 
        setIsLoading(true);
        await Post(
            "/api/Flashcard/learn-flashcard", 
            data, 
            // userData?.token ?? ""
        ).then( async (res) => {
            if(CheckResponseSuccess(res)) {
                let id = document.getElementById('flip_card');
                
                // next thẻ tiếp theo 
                // if (currentIndex + 1 < listFlashcardLearn?.length) {
                    // setCurrentCard(listFlashcardLearn?.[currentIndex + 1]);
                    // setCurrentIndex(currentIndex + 1);
                    // setIsFront(true);
                // }
                // nếu đã hết thẻ 
                // else {
                    // call api để Show chart và bước tiếp theo
                    // let listFlashcard = await getListFlashcard();
                    // setListFlashcard(listFlashcard);
                    
                // }


                // let currentIndex = listFlashcardLearn.findIndex(card => card.flashcardId == currentCard?.flashcardId);
        
                Swal.fire({
                    title: "Bạn đã hoàn thành kiểm tra",
                    icon: "success",
                    timer: 600,
                });
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

    const handleTestAgain = async () => {
        setIsLoading(true)
        await getListFlashcardExam(true);
        setIsLoading(false)
        setShowResult(false);
        setOpenModal(false);
        setDataOvalChart([])
        setTimeStart(Date.now())
    }

    const handleChangeType = (check:any, type:any) => {
        if (check) {
            let newList = listQuesType.filter((item) => item.id != type.id);
            setListQuesType(newList);
        }
        else {
            setListQuesType((prev: any) => [...prev, type]);
        }
    }   

    const handleChangeNumQues = (e:any) => {
        let value = e.target.value;
        if (value > maxPageSize) {
            value = maxPageSize;
        }
        setPageSize(value);
    }

    const handleSpeak = (text:string) => {
        let utterance = new SpeechSynthesisUtterance(text);

        speechSynthesis.speak(utterance);
    }

    const genListMultipleAns = (card:IFlashcard, listAllFlashCard:IFlashcard[]) => {
        let listAnsTemp = [];
        // tạo 4 cái đáp án
        let listAllCard = listAllFlashCard?.filter((item:IFlashcard) => item.flashcardId != card.flashcardId);
        let q1:IFlashcard =  listAllCard[Math.floor(Math.random() * listAllCard.length)];

        listAllCard = listAllCard.filter((card:IFlashcard) => card.flashcardId != q1.flashcardId);
        let q2:IFlashcard =  listAllCard[Math.floor(Math.random() * listAllCard.length)];
        
        listAllCard = listAllCard.filter((card:IFlashcard) => card.flashcardId != q2.flashcardId);
        let q3:IFlashcard =  listAllCard[Math.floor(Math.random() * listAllCard.length)];
        
        listAnsTemp.push(q1);
        listAnsTemp.push(q2);
        listAnsTemp.push(q3);

        let answerIndex = Math.floor(Math.random() * 3);

        let listAns = [];
        let i = 0;
        while(i < 3) {
            if (i != answerIndex) {
                listAns.push(listAnsTemp[i]);
                i++;
            }
            else {
                listAns.push(card);
                answerIndex = -1;
            }
        }
        // setListAnsMultiple(listAns);
        return listAns;
    }
 
    const RenderQuestion = (props: {card:IFlashcard, callBackAnswer:any}) => {
        const {card, callBackAnswer} = props;
        const [listAnsMultiple, setListAnsMultiple] = useState<IFlashcard[]>(card.listMultipleAns || []);
        // const [answer, setAnswer] = useState<string|null>(null);
        const [inputAnswer, setInputAnswer] = useState("");

        // useEffect(() => {
        //     if (card.questionType?.id == 'MULTIPLE' && card.learn == null && card.answerExam ==  null) {
                
        //     }
        // }, [])

        return (
            <>
                <div className={`${styles.card}`}>
                    <div className={styles.top}>
                        <div className={styles.title}>
                            Thuật ngữ
                            {/* {card?.learns?.[0].recentWrongLearn == false ? null : <span className={styles.retry}>Hãy thử lại lần nữa</span>} */}
                        </div>
                        {card.questionType?.id != 'AUDIO' ? 
                            <div className={styles.top_content}>
                                {card?.question}
                            </div>
                        :    
                            <div className={styles.top_content}>
                                Hãy điền thông tin bạn nghe được 
                                <span onClick={() => handleSpeak(card?.question ?? '')} className={`bx bx-volume-full ${styles.audio_btn}`}></span>
                            </div>
                        }
                    </div>

                    <div className={styles.bottom}>
                        {/* Render question */}
                        <div className={styles.title}>{card.questionType?.id == 'MULTIPLE' ? 'Chọn đáp án đúng' : 'Đáp án của bạn'}</div>
                        <div className={styles.bot_content}>
                            {card.questionType?.id == 'MULTIPLE' ? 
                                <div className={`${styles.multiple} row`}>
                                    {listAnsMultiple.map((item, index) => {
                                        let right = null;
                                        if (showResult) {
                                            if(item.answer == card?.answer) {
                                                right = true;
                                            }
                                            else if (item.answer == card.answerExam) {
                                                right = false;
                                            }
                                        }

                                        return (
                                            <div key={Math.random()} className="col-6">
                                                <div 
                                                    onClick={() => {
                                                        // chặn onClick nếu đang show kết quả
                                                        if (showResult) {return; }
                                                        setInputAnswer(item?.answer); callBackAnswer(item.answer, card);
                                                    }} 
                                                    className={`${styles.choice} 
                                                                ${showResult && right == true ? styles.right : 
                                                                    (showResult && right == false ? styles.wrong : 
                                                                        (showResult ? styles.disable : 
                                                                            (inputAnswer == item?.answer ? styles.pending_ans :'')    
                                                                        ))}`}
                                                >
                                                    {showResult && right == true ?
                                                        <span className={`bx bx-check ${styles.icon}`}></span>
                                                    : (showResult && right == false ?
                                                        <span className={`bx bx-x ${styles.icon}`}></span>
                                                    : 
                                                        <div className={styles.num}>
                                                            {index + 1}
                                                        </div>
                                                    )}

                                                    <div className={styles.answer}>
                                                        {item?.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            :
                                <div className={styles.one}>
                                    <div className={styles.answer}>
                                        {showResult && card.learn == true ? 
                                            <div className={`${styles.choice} ${styles.right}`}>
                                                <span className={`bx bx-check ${styles.icon}`}></span>
                                                <div className={styles.answer}>
                                                    {card.answerExam}
                                                </div>
                                            </div> 
                                        : (showResult && card.learn == false) ? 
                                            <>
                                                <div className={`${styles.choice} ${styles.wrong}`}>
                                                    <span className={`bx bx-x ${styles.icon}`}></span>
                                                    <div className={styles.answer}>
                                                        {card.answerExam}
                                                    </div>
                                                </div> 
                                                <div style={{color: 'rgb(98 197 162)'}} className={styles.title}>Đáp án đúng</div>
                                                <div className={`${styles.choice} ${styles.right}`}>
                                                    <span className={`bx bx-check ${styles.icon}`}></span>
                                                    <div className={styles.answer}>
                                                        {/* {Number(card?.learns?.[0].countLearnedTrue) < 2 ? card?.answer : card?.question} */}
                                                        {card.questionType?.id == 'ONE' ? card?.answer : card?.question}
                                                    </div>
                                                </div> 
                                            </>
                                        :
                                            <input 
                                                className={styles.input}
                                                type="text"
                                                value={inputAnswer}
                                                onChange={(e) => setInputAnswer(e.target.value)}
                                                onBlur={() => callBackAnswer(inputAnswer, card)}
                                            />
                                        }
                                    </div>
                                    {/* <div className={styles.button}>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary"
                                            onClick={() => callBackAnswer(inputAnswer, card)}
                                            disabled={showResult ? true : false}
                                        >Trả lời</button>
                                    </div> */}
                                </div>            
                            }
                        
                        </div>
                    </div>
                </div>
                
            </>
        )
    }

    const handleSetDataChart = (listCard:IFlashcard[]) => {
        let dataChard = [
            {
                y: Number(((listCard?.filter((card:IFlashcard) => card.learn == true)?.length / listCard?.length)*100).toFixed(2)) ?? 0,
                x: 'Đúng'
            },
            {
                y: Number(((listCard?.filter((card:IFlashcard) => card.learn == false)?.length / listCard?.length)*100).toFixed(2)) ?? 0,
                x: 'Sai'
            },
        ];
        let sumary = dataChard[0];
        // if(dataChard[2].y > 0) sumary = dataChard[2];
        // if(dataChard[3].y > 0) sumary = dataChard[3];
        
        setTotalInfo(sumary.y + '% ' + sumary.x);
        dataChard = dataChard.filter(item => item.y > 0)
        setDataOvalChart(dataChard);

    }

    const optionsChart = {
        // exportEnabled: true,
        animationEnabled: true,
        theme: "light1",  
        creditText: "",
        creditHref: "",
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
            toolTipContent: "<b>{x}</b>: {y}%",
            dataPoints: dataOvalChart
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
        <div className={`${styles.container}`}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <PopupMenu 
                        renderBtn={(handleClick:any) => (
                            <div className="d-flex cursor-pointer" onClick={handleClick}>
                                <span id="demo-positioned-button" className={`bx bxs-edit-alt ${styles.icon_color}`}></span>
                                <p className={styles.title}>
                                    Kiểm tra
                                    <span className='bx bx-chevron-down'></span>
                                </p>
                            </div>
                        )}
                        renderItem={() => (
                            <div>
                                <MenuItem onClick={() => navigate(`/credit/${credit.creditId}`)} className={`menu_item`}>
                                    <span className={`bx bxs-collection icon`} style={{color: '#696cff'}}></span>
                                    Thẻ ghi nhớ
                                </MenuItem>
                                <MenuItem onClick={() => navigate(`/learn/${credit.creditId}`)} className={`menu_item`}>
                                    <span className={`bx bxs-edit-alt icon`} style={{color: '#696cff'}}></span>
                                    Luyện tập
                                </MenuItem>
                                <MenuItem onClick={() => navigate(`/match/${credit.creditId}`)} className={`menu_item`}>
                                    <span className={`bx bxs-extension icon`} style={{color: '#696cff'}}></span>
                                    Ghép thẻ
                                </MenuItem>
                                <hr className="p-0 m-0"/>
                                <MenuItem onClick={() => navigate(`/`)} className="menu_item">
                                    Trang chủ
                                </MenuItem>

                            </div>
                        )}
                    />
                </div>

                <div className={styles.middle}>
                    <div className={styles.title}>
                        {credit.name} 
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.btn} onClick={() => setOpenModal(true)}>
                        <span className={styles.btn_text}>Tùy chọn</span>
                    </div>
                    <div onClick={() => navigate(`/credit/${credit.creditId}`)} className={styles.btn}>
                        <span className='bx bx-x'></span>
                    </div>
                </div>
            </div>
            {/* <LinearProgress className={`${styles.progress}`} variant="determinate" value={(currentIndex*100)/listFlashcardLearn.length} /> */}
            
            
            {showResult ? <div className={styles.result_container}>
                <div className={styles.result}>
                    <div className={`${styles.flashcard} my-5`}>
                        <div className="title row align-items-center">
                            <h2 className="col-9">Bạn đang làm rất tốt !</h2>
                            <img className="col-2 rotate-270" src='/src/assets/img/icons/confetti_icon.png' />
                        </div>
                        <div className="content row">
                            <div className="col-6">
                                <h4 className="fw-bold">Kết quả của bạn: {timeEnd}</h4>
                                <CanvasJSChart options = {optionsChart}
                                    /* onRef={ref => this.chart = ref} */
                                />
                            </div>
                            <div className="col-6">
                                <h4 className="fw-bold">Bước tiếp theo</h4>
                                <div className={styles.next_process}>
                                    <div onClick={() => handleTestAgain()} className={`card hstack mx-1 my-3 row hoverable cursor-pointer`}>
                                            <div className={`col-2 `}>
                                                <i className={`bx bxs-edit-alt ${styles.icon}`}></i>
                                            </div>
                                            <div className={`col-10 ${styles.content}`}>
                                                <h5 className={styles.title}>
                                                    Kiểm tra
                                                </h5>
                                                <p className={styles.descrip}>Làm lại bài kiểm tra mới cho bộ thẻ này</p>
                                            </div>
                                        </div>

                                        <div onClick={() => navigate(`/learn/${credit.creditId}`)} className={`card hstack mx-1 my-3 row hoverable cursor-pointer`}>
                                            <div className={`col-2 `}>
                                                <i className={`bx bxs-book-reader ${styles.icon}`}></i>
                                            </div>
                                            <div className={`col-10 ${styles.content}`}>
                                                <h5 className={styles.title}>
                                                    Ôn tập
                                                </h5>
                                                <p className={styles.descrip}>Ôn lại các thẻ bằng phương pháp "Luyện tập"</p>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : null}

            <div className={styles.content_container}>
                <div className={styles.content}>
                    {listFlashcardExam.map((card) => (
                        <RenderQuestion card={card} callBackAnswer={handleAnswer} key={card.flashcardId}/>
                        
                    ))}
                    
                    <div className={`${styles.submit_btn}`}> 
                        {showResult ? null : 
                            <button className={`btn`} onClick={() => handleShowResult()}>Gửi kết quả</button>
                        }
                    </div>
                </div>
            </div>

            {/* Modal tùy chỉnh*/}

            {/* Dialog add Credit */}
            <BootstrapDialog
                onClose={() => setOpenModal(false)}
                aria-labelledby="customized-dialog-title"
                open={openModal}
                maxWidth={'sm'}
                fullWidth={true}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Tùy chỉnh
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenModal(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent dividers>
                    <div className={styles.popup}>
                        <div className={styles.num}>
                            <div className={styles.title}>
                                Số lượng câu hỏi (tối đa {maxPageSize})
                            </div>
                            <div className={styles.input}>
                                <TextField
                                    required
                                    id="name"
                                    value={pageSize}
                                    // name="loginName"
                                    fullWidth
                                    margin="dense"
                                    variant="outlined" 
                                    size="small"
                                    onChange={(e) => handleChangeNumQues(e)}
                                />
                            </div>
                        </div>
                        <hr />
                        <div className={styles.type_question}>
                            {/* <div className={styles.title}>
                                Loại câu hỏi
                            </div> */}
                            <div className={styles.type_container}>
                                {QUESTION_TYPE.map((type) => {
                                    let check = listQuesType.some((item:any) => item.id == type.id)

                                    return (
                                        <div className={styles.type} key={type.id}>
                                            <div className={styles.title} onClick={() => handleChangeType(check, type)}>
                                                {type.label}
                                            </div>
                                            <div className={styles.check_box}>
                                                <Checkbox
                                                    checked={check}
                                                    onChange={() => handleChangeType(check, type)}
                                                    // inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </DialogContent>


                <DialogActions>
                    {/* <Button autoFocus onClick={() => handleSubmit()}>
                        Lưu
                    </Button> */}
                    <button type="button" className={`btn btn-primary`} onClick={() => handleTestAgain()}>Tạo bài kiểm tra mới</button>
                </DialogActions>
            </BootstrapDialog>
        </div>
        
    </>)
};
