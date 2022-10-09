import { Word } from "@prisma/client";
import { SetStateAction, useState } from "react";
import styles from "./index.module.scss";

type Props = {
  word: Word;
  onDelete: (id: string) => Promise<void>;
};

const WordCard: React.FC<Props> = ({ word, onDelete }) => {
  const [isMeaning, setIsMeaning] = useState<boolean>(false);
  return (
    <div className={styles.word} onClick={() => setIsMeaning((prev) => !prev)}>
      {isMeaning ? (
        <span className="text-base my-5 line-clamp-3">{word.meaning}</span>
      ) : (
        <span className="font-cal text-3xl">{word?.word}</span>
      )}
      <p className={styles.delete} onClick={() => onDelete(word.id)}>
        ✖️
      </p>
    </div>
  );
};

export default WordCard;
