import { Dungeons } from "@/components/dungeons";
import styles from "./dungeons.module.scss";

export default async function DungeonsPage() {
  return (
    <main className={styles.dungeonsPageWrapper}>
      <h1>Dungeons</h1>
      <Dungeons />
    </main>
  );
}
