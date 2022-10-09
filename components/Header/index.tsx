import { signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./index.module.scss";
const Header = () => {
  return (
    <div className={styles.wrapper}>
      <Link href="/">MyWords</Link>
      <button
        className="text-gray-500 hover:text-gray-700 transition-all ease-in-out duration-150"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </div>
  );
};
export default Header;
