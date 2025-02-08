import Link from "next/link"
import styles from "./not-found.module.css"

export default function Custom404() {
  return (
    <div className={styles.container}>
      <h1 className={styles.error_code}>404</h1>
      <p className={styles.error_message}>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" prefetch={true} className={styles.home_link}>
        Go Home
      </Link>
    </div>
  )
}
