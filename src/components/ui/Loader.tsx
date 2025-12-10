import styles from "./Loader.module.css";
import { clsx } from "clsx";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const Loader = ({ size = "md", className }: LoaderProps) => {
    return (
        <div className={clsx(styles.loader, styles[size], className)}>
            <div className={styles.spinner} />
        </div>
    );
};
