import React from "react";
import styles from "./Card.module.scss"; // optional, for CSS modules
import clsx from "clsx";

interface Props {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isGreenCard?: boolean;

  // specific props
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Card: React.FC<Props> = ({
  children,
  style,
  className,
  isGreenCard = false,
  selected = false,
  disabled = false,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        styles.card,
        className,
        isGreenCard ? styles.isGreenCard : "",
        selected ? styles.selected : "",
        disabled ? styles.disabled : ""
      )}
      style={{
        cursor: disabled ? "not-allowed" : "auto",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onClick={() => !disabled && onClick?.()}
    >
      {children}
    </div>
  );
};

export default Card;
