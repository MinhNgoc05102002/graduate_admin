import { ICredit, IProps } from "~/types/ICredit";
import styles from "./CreditComponent.module.scss";
import { Link } from "react-router-dom";
import { IFlashcard, IFlashcardProps } from "~/types/IFlash";
import Card from "./Card";

const LIST_LEARN = [
    {
        id: '0',
        label: "Chưa học",
        description: "Bạn đã bắt đầu học những thuật ngữ này. Tiếp tục phát huy nhé!",
        style: 'new'
    },
    {
        id: '1',
        label: "Đang học",
        description: "Bạn đã bắt đầu học những thuật ngữ này. Tiếp tục phát huy nhé!",
        style: 'learning'
    },
    {
        id: '2',
        label: "Đã biết",
        description: "Bạn đã bắt đầu học những thuật ngữ này. Tiếp tục phát huy nhé!",
        style: 'learned'
    },
    {
        id: '3',
        label: "Thành thạo",
        description: "Bạn đã bắt đầu học những thuật ngữ này. Tiếp tục phát huy nhé!",
        style: 'learned2'
    }
]

export default function ListCard(props:{flashcards:IFlashcard[], isLearned: boolean}) {
    const {flashcards, isLearned} = props;
    
    // cái hoặc đằng sau chỉ xảy ra trong trg hợp có thông tin trong bảng AccountLearnCredit nhưng k có dữ liệu trogn bảng Learn
    if (!isLearned || !flashcards[0]?.learns?.[0]) {
        return (
            <>
                <div className={styles.list}>
                    {flashcards.map((card) => (
                        <Card flashcard={card} key={card.flashcardId}/>
                    ))}
                </div>
                
            </>
        )
    }

    return (
        <>
            {LIST_LEARN.map((item, index) => {
                let count = flashcards.filter((card) => card?.learns?.[0]?.process == item.id).length;
                if (count == 0) 
                    return (<div key={index + 10}> </div>);
                else return (<div key={item.id}>
                    <div className={styles.head}>
                        <div className={`${styles.title} ${styles[item.style]}`}>
                            {item.label} ({count})
                        </div>
                        <div className={styles.descript}>
                            {item.description}
                        </div>
                    </div>
                    
                    <div className={styles.list}>
                        {flashcards.filter((card) => card?.learns?.[0]?.process == item.id).map((card) => (
                            <Card flashcard={card} key={card.flashcardId}/>
                        ))}
                    </div>
                </div>)
                
            })}
            
        </>
    )
};
