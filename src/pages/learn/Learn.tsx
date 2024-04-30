import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading, { PopupMenu } from "~/components/Loading/Index";
import styles from "~/pages/learn/Learn.module.scss";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";

// import required modules
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from '@mui/material/MenuItem';
import 'animate.css';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { IFlashcard } from "~/types/IFlash";
import NotFound from "../notfound/NotFound";
import { current } from "@reduxjs/toolkit";
import ListCard from "~/components/Credit/Detail";

const QUESTION_TYPE = {
    '0': 'MULTIPLE',
    '1': 'ONE',
    '2': 'AUDIO',
}

export default function Learn() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);
    const creditId = GetIdFromCurrentPage();
    const [credit, setCredit] = useState<ICredit|null>(null);
    const [isLearned, setIsLearned] = useState(false);
    const [listFlashcardLearn, setListFlashcardLearn] = useState<IFlashcard[]>([]);
    const [currentCard, setCurrentCard] = useState<IFlashcard|null>(null);
    const [isEnd, setIsEnd] = useState(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [listAnsMultiple, setListAnsMultiple] = useState<IFlashcard[]>([]);
    const [typeQuestion, setTypeQuestion] = useState<Number>(0);
    const [answer, setAnswer] = useState<string|null>(null);
    const [inputAnswer, setInputAnswer] = useState('');
    const [learned, setLearned] = useState(null);

    const navigate = useNavigate();
    const [round, setRound] = useState(1);

    useEffect(() => {
        if (creditId) {
            getStartupData();
        }
        // handleSetDataChart();
    }, [creditId]);

    useEffect(() => {
        setTypeQuestion(currentCard?.learns?.[0].countLearnedTrue ?? 0);
        if (currentCard?.learns?.[0].countLearnedTrue == 0) {
            let listAnsTemp = [];
            // tạo 4 cái đáp án
            let listAllCard = listFlashcardLearn.filter((card:IFlashcard) => card.flashcardId != currentCard.flashcardId);
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
                    listAns.push(currentCard);
                    answerIndex = -1;
                }
            }
            setListAnsMultiple(listAns);
        }
    }, [currentCard, currentIndex]);

    const getStartupData = async () => {
        setIsLoading(true);

        await Promise.all([
            getInfoCredit(),
            getListFlashcardLearned(),
        ]).then((response: any) => {
            // if (isEditMode) saveDataEdit(response[0], response[1], response[2], response[3]);

            // setListFlashcardLearn(response[1]);
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

    const getListFlashcardLearned = async () => {
        let listCardLearned:IFlashcard[] = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid-learned2", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 10,
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
                    
                    setCurrentIndex(0)
                    setCurrentCard(flashcards[0]);
                    setListFlashcardLearn(listCardLearned)
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

    const handleSpeak = (text:string) => {
        let utterance = new SpeechSynthesisUtterance(text);

        speechSynthesis.speak(utterance);
    }

    


    const handleNext = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 100);
        // let learned = (currentCard?.answer.toLowerCase() == currentCard?.answer?.toLowerCase) ? true : false;

        // // đối với câu hỏi phát âm
        // if (Number(currentCard?.learns?.[0].countLearnedTrue) >= 2) {
        //     learned == (currentCard?.question.toLowerCase() == answer?.toLowerCase()) ? true : false;
        // }
        setAnswer(null)
        setInputAnswer('');
        // setListAnsMultiple([]);

        if (learned == true) {
            if (currentIndex + 1 < listFlashcardLearn.length) {
                setCurrentCard(listFlashcardLearn[currentIndex + 1])
            }
            else {
                setIsEnd(true);
            }
            setCurrentIndex((prev) => prev + 1)
        } 
        else {
            let newListCard = listFlashcardLearn.filter((card) => card.flashcardId != currentCard?.flashcardId);
            let newCard = currentCard;
            if (newCard?.learns?.[0]) {
                newCard.learns[0].recentWrongLearn = true;
                newCard.learns[0].countLearnedTrue = 0;
            }
            if (newCard != null) newListCard.push(newCard);
            setCurrentCard(newListCard[currentIndex]);
            setListFlashcardLearn(newListCard)
        }
    }
    
    const handleAnswer = async(answer: string) => {
        setAnswer(answer);

        let learn:any = currentCard?.answer.trim().toLowerCase() == answer.trim().toLowerCase() ? true : false;
        // đối với câu hỏi phát âm
        if (Number(currentCard?.learns?.[0].countLearnedTrue) >= 2) {
            console.log('here');
            
            learn = (currentCard?.question.trim().toLowerCase() == answer.trim().toLowerCase()) ? true : false;
            console.log('here', learn);
        }

        console.log({currentCard, answer}, learn)
        setLearned(learn)
        // call api 
        let data = [];
        data.push({
            flashcardId: currentCard?.flashcardId,
            hasKnown: learn,
            typeLearn: "LEARN"
        });

        // setIsLoading(true);
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

    const handleNextRound = async () => {
        setIsLoading(true);
        await getListFlashcardLearned();
        setAnswer(null);
        setInputAnswer('')
        setRound(prev => prev + 1);
        setIsEnd(false);
        setLearned(null);

        setIsLoading(false);
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
                                <span id="demo-positioned-button" className={`bx bxs-book-reader ${styles.icon_color}`}></span>
                                <p className={styles.title}>
                                    Luyện tập
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
                                <MenuItem onClick={() => navigate(`/exam/${credit.creditId}`)} className={`menu_item`}>
                                    <span className={`bx bxs-edit-alt icon`} style={{color: '#696cff'}}></span>
                                    Kiểm tra
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
                        {credit.name} - Vòng {round}
                    </div>
                </div>

                <div className={styles.right}>
                    {/* <div className={styles.btn}>
                        <span className={styles.btn_text}>Tùy chọn</span>
                    </div> */}
                    <div onClick={() => navigate(`/credit/${credit.creditId}`)} className={styles.btn}>
                        <span className='bx bx-x'></span>
                    </div>
                </div>
            </div>
            <LinearProgress className={`${styles.progress}`} variant="determinate" value={(currentIndex*100)/listFlashcardLearn.length} />
            
            {!isEnd ? <div className={styles.content}>
                <div className={`${styles.card}`}>
                    <div className={styles.top}>
                        <div className={styles.title}>
                            Thuật ngữ
                            {currentCard?.learns?.[0].recentWrongLearn == false ? null : <span className={styles.retry}>Hãy thử lại lần nữa</span>}
                        </div>
                        {Number(currentCard?.learns?.[0].countLearnedTrue) < 2 ? 
                            <div className={styles.top_content}>
                                {currentCard?.question}
                            </div>
                        :    
                            <div className={styles.top_content}>
                                Hãy điền thông tin bạn nghe được 
                                <span onClick={() => handleSpeak(currentCard?.question ?? '')} className={`bx bx-volume-full ${styles.audio_btn}`}></span>
                            </div>
                        }
                    </div>

                    <div className={styles.bottom}>
                        {/* Render question */}
                        <div className={styles.title}>{typeQuestion == 0 ? 'Chọn đáp án đúng' : 'Đáp án của bạn'}</div>
                        <div className={styles.bot_content}>
                            {typeQuestion == 0 ? 
                                <div className={`${styles.multiple} row`}>
                                    {listAnsMultiple.map((card, index) => {
                                        let right = null;
                                        if (answer) {
                                            if(card.answer == currentCard?.answer) {
                                                right = true;
                                            }
                                            else if (card.answer == answer) {
                                                right = false;
                                            }
                                        }

                                        return (
                                            <div key={Math.random()} className="col-6">
                                                <div 
                                                    onClick={() => {
                                                        if (!answer) {
                                                            handleAnswer(card.answer)
                                                        }
                                                    }} 
                                                    className={`${styles.choice} 
                                                                ${answer && right == true ? styles.right : (answer && right == false ? styles.wrong : (answer ? styles.disable : ''))}`}
                                                >
                                                    {answer && right == true ?
                                                        <span className={`bx bx-check ${styles.icon}`}></span>
                                                    : (answer && right == false ?
                                                        <span className={`bx bx-x ${styles.icon}`}></span>
                                                    : 
                                                        <div className={styles.num}>
                                                            {index + 1}
                                                        </div>
                                                    )}

                                                    <div className={styles.answer}>
                                                        {card?.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            :
                                <div className={styles.one}>
                                    <div className={styles.answer}>
                                        {answer && learned == true ? 
                                            <div className={`${styles.choice} ${styles.right}`}>
                                                <span className={`bx bx-check ${styles.icon}`}></span>
                                                <div className={styles.answer}>
                                                    {answer}
                                                </div>
                                            </div> 
                                        : (answer && learned == false) ? 
                                            <>
                                                <div className={`${styles.choice} ${styles.wrong}`}>
                                                    <span className={`bx bx-x ${styles.icon}`}></span>
                                                    <div className={styles.answer}>
                                                        {answer}
                                                    </div>
                                                </div> 
                                                <div style={{color: 'rgb(98 197 162)'}} className={styles.title}>Đáp án đúng</div>
                                                <div className={`${styles.choice} ${styles.right}`}>
                                                    <span className={`bx bx-check ${styles.icon}`}></span>
                                                    <div className={styles.answer}>
                                                        {Number(currentCard?.learns?.[0].countLearnedTrue) < 2 ? currentCard?.answer : currentCard?.question}
                                                    </div>
                                                </div> 
                                            </>
                                        :
                                            <input 
                                                className={styles.input}
                                                type="text"
                                                value={inputAnswer}
                                                onChange={(e) => setInputAnswer(e.target.value)}
                                            />
                                        }
                                    </div>
                                    <div className={styles.button}>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary"
                                            onClick={() => handleAnswer(inputAnswer)}
                                            disabled={answer ? true : false}
                                        >Trả lời</button>
                                    </div>
                                </div>            
                            }
                        
                        </div>
                    </div>
                </div>

                {answer ? <div className={styles.footer}>
                    <div className={styles.btn_next}>
                        <div className={styles.text}>Đến câu hỏi tiếp theo</div>
                        <div className={styles.button}>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => handleNext()}
                            >Tiếp tục</button>
                        </div>
                    </div>
                </div>
                : null}
            </div>
            : 
             <div className={styles.end_container}>
                <div className={styles.end_content}>
                    <div className={styles.title}>Thuật ngữ đã học trong vòng này ({listFlashcardLearn.length}) </div>
            
                    <ListCard flashcards = {listFlashcardLearn} isLearned={false}/>
                    {/* <ListCard flashcards = {listFlashcardLearn} isLearned={false}/> */}
                </div>
                <div className={styles.footer}>
                    <div className={styles.btn_next}>
                        <div className={styles.text}>Đến vòng tiếp theo</div>
                        <div className={styles.button}>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => handleNextRound()}
                            >Tiếp tục</button>
                        </div>
                    </div>
                </div>
             </div>
            }
        </div>
        
    </>)
};
