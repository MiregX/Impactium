import Link from "next/link";
import styles from "./index.module.css";

export default function Page() {
  return (
    <div>
      <p>Главная страница</p>
      <Link href="/me/account">Мой профиль</Link>
    </div>
  );
}
