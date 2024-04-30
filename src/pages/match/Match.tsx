import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loading, { PopupMenu } from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage, findNotifDate } from "~/utils/common";
import styles from "./Match.module.scss";

// import required modules
import MenuItem from '@mui/material/MenuItem';
import 'animate.css';
import { useNavigate } from "react-router-dom";
import { IFlashcard } from "~/types/IFlash";
import NotFound from "../notfound/NotFound";
import ListCard from "~/components/Credit/Detail";


interface IMatchCard {
    flashcard: IFlashcard
    isFront: boolean
}

export default function Match() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);
    const creditId = GetIdFromCurrentPage();
    const [credit, setCredit] = useState<ICredit|null>(null);
    const [listFlashcardMatch, setListFlashcardMatch] = useState<IMatchCard[]>([]);
    const [listCard, setListCard] = useState<IFlashcard[]>([]);

    const [cardSelected, setCardSelected] = useState<IMatchCard|null>(null);
    const [cardMatched, setCardMatched] = useState<IMatchCard|null>(null);
    const [matching, setMatching] = useState<boolean|null>(null);
    const [matchTrue, setMatchTrue] = useState<IMatchCard[]>([]);
    const [isEnd, setIsEnd] = useState(false);
    const [timeStart, setTimeStart] = useState(Date.now());
    const [timeEnd, setTimeEnd] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        if (creditId) {
            getStartupData();
        }
        // handleSetDataChart();
    }, [creditId]);

    useEffect(() => {
        if (cardMatched) {
            // trường hợp match đúng
            if(cardSelected?.flashcard?.flashcardId == cardMatched.flashcard?.flashcardId && cardSelected?.isFront != cardMatched.isFront) {
                setMatching(true);
                setMatchTrue(prev => [...prev, cardSelected]);
                if (matchTrue.length == listCard.length - 1) {
                    setIsEnd(true);
                    let timeEnd = findNotifDate(timeStart.toString(), true);
                    setTimeEnd(timeEnd);
                }
            }
            // trường hợp match sai
            else {
                setMatching(false);
            }
        }
    }, [cardMatched])

    useEffect(() => {
        if (matching != null) {
            setTimeout(() => {
                setCardSelected(null);
                setCardMatched(null);
                setMatching(null);
            }, 300)
        }
    }, [matching])

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

    // TODO: viết lại cách lấy cái list thẻ ở đây ( chuyển thành lấy random )
    const getListFlashcardLearned = async () => {
        let listCardLearned:IFlashcard[] = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid-match", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 6,
                pageIndex: 1,
                username: userData?.username,
                containerId: creditId
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let flashcards = res?.returnObj;
                if (flashcards) {
                    
                    setListCard(flashcards);
                    listCardLearned = [...flashcards]

                    // ... xử lý ở đây
                    let listRes:IMatchCard[] = [];
                    let index;
                    while(listRes.length < 12) {
                        index = Math.floor(Math.random() * listCardLearned.length);
                        let card = listCardLearned[index];

                        let isFront = !!(Math.round(Math.random()));
                        let cardExist = listRes.find((item) => item?.flashcard?.flashcardId == card?.flashcardId)
                        if (cardExist) {
                            isFront = !cardExist.isFront;
                            listCardLearned = listCardLearned.filter((item) => item?.flashcardId != card?.flashcardId)
                        }

                        listRes.push({
                            flashcard: card,
                            isFront: isFront
                        })
                    }
                    setListFlashcardMatch(listRes)
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

    const handleSelectCard = (match:IMatchCard) => {
        // setCardSelected(match)
        if(!cardSelected) {
            setCardSelected(match)
        }
        else {
            // Trường hợp nhấn tiếp vào thẻ ấy 
            let isMatch = matchTrue.some(item => item.flashcard.flashcardId == match.flashcard.flashcardId);
            if((cardSelected.flashcard.flashcardId == match.flashcard.flashcardId && cardSelected.isFront == match.isFront) || isMatch) {
                return;
            }
            else {
                setCardMatched(match);
                
            }
        }
    }

    const handleStartAgain = () => {
        setIsLoading(true);

        getListFlashcardLearned();
        setCardSelected(null);
        setCardMatched(null);
        setMatching(null);
        setMatchTrue([]);
        setIsEnd(false);
        setTimeStart(Date.now());

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

    if (listCard.length < 6) {
        console.log(listCard.length)
        return (
            <>
                Phương pháp "Ghép thẻ hiện chỉ có hiệu lực với bộ thẻ có từ 6 flashcard trở lên"
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
                                <MenuItem onClick={() => navigate(`/learn/${credit.creditId}`)} className={`menu_item`}>
                                    <span className={`bx bxs-edit-alt icon`} style={{color: '#696cff'}}></span>
                                    Luyện tập
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
                    {/* <div className={styles.btn}>
                        <span className={styles.btn_text}>Tùy chọn</span>
                    </div> */}
                    <div onClick={() => navigate(`/credit/${credit.creditId}`)} className={styles.btn}>
                        <span className='bx bx-x'></span>
                    </div>
                </div>
            </div>
            
            {!isEnd ? <div className={styles.content_container}>
                <div className={styles.content}>
                    <div className="row">
                        {listFlashcardMatch.map((match) => {
                            let data = match.isFront ? match.flashcard?.question : match.flashcard?.answer;
                            if (data?.length > 135) {
                                data = data?.slice(0, 130) + '...';
                            }
                            let isSelected = (match.flashcard?.flashcardId == cardSelected?.flashcard?.flashcardId && match.isFront == cardSelected?.isFront);
                            let isSecondCard = (match.flashcard?.flashcardId == cardMatched?.flashcard?.flashcardId && match.isFront == cardMatched?.isFront);
                            let styleMatch = '';
                            let isMatched = matchTrue.some(item => item.flashcard.flashcardId == match.flashcard.flashcardId);
                            if ((isSecondCard || isSelected)) {
                                if (matching == true) {
                                    styleMatch = 'animate__animated animate__bounceOut'
                                } 
                                if (matching == false) {
                                    styleMatch =`${styles.match_false} animate__animated animate__headShake`
                                }
                            }

                            return (
                                <div key={Math.random()} className="col-3">
                                    <div 
                                        className={`${styles.card} ${ isSelected ? styles.active : null}
                                                    ${styleMatch} ${isMatched ? styles.display_none : ''}`}
                                        // className={`${styles.card}  ${isSelected ? styles.display_none : ''}`}
                                        onClick={() => handleSelectCard(match)}
                                    >
                                        <div className={styles.data}>
                                            {data}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        
                    </div>
                </div>
            </div>
            : 
            <div className={styles.end_container}>
                <div className={styles.end_content}>
                    <div className={styles.title}>Thuật ngữ bạn đã xem ({listCard.length}) </div>
            
                    <ListCard flashcards = {listCard} isLearned={false}/>
                    {/* <ListCard flashcards = {listFlashcardLearn} isLearned={false}/> */}
                </div>
                <div className={styles.footer}>
                    <div className={styles.btn_next}>
                        <div className={styles.text}>Bạn đã hoàn thành trong {timeEnd}</div>
                        <div className={styles.button}>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => handleStartAgain()}
                            >Chơi lại</button>
                        </div>
                    </div>
                </div>
            </div>
            }



        </div>
        
    </>)
};
