import { Dialog } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { HttpMethod } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingDots from "@/components/app/loading-dots";
import styles from "./index.module.scss";
import { useSWRConfig } from "swr";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
type Form = {
  name: string;
};

const AddBookModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<Form>({ mode: "onChange" });
  const { data: session } = useSession();
  const sessionId = session?.user?.id;
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { mutate } = useSWRConfig();

  const onSubmit: SubmitHandler<Form> = async (data, e) => {
    e?.preventDefault();
    setIsSubmiting(true);
    await fetch("/api/book", {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionId,
        name: data.name,
      }),
    });
    setIsSubmiting(false);
    mutate("/api/book");
    onClose();
  };

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.modal}>
      <form
        onSubmit={(e) => handleSubmit(onSubmit)(e)}
        className={styles.innerFrom}
      >
        <h2 className="font-cal text-2xl mb-6">単語帳を追加</h2>
        <div className="grid gap-y-5 w-5/6 mx-auto">
          <div className="border border-gray-700">
            <input
              className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
              placeholder="名前"
              {...register("name", { required: true })}
              type="text"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-10 w-full">
          <button
            type="button"
            className="w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
            onClick={() => {
              onClose();
            }}
          >
            キャンセル
          </button>

          <button
            type="submit"
            disabled={isSubmiting || !isValid}
            className={`${
              isSubmiting || !isValid
                ? "cursor-not-allowed text-gray-400 bg-gray-50"
                : "bg-white text-gray-600 hover:text-black"
            } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
          >
            {isSubmiting ? <LoadingDots /> : "追加"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddBookModal;
