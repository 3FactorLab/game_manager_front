import React from "react";
import { clsx } from "clsx";
import styles from "./Card.module.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  className,
  hoverable = false,
  padding = "md",
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        styles.card,
        hoverable && styles.hoverable,
        styles[`padding-${padding}`],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
