import React, { FunctionComponent, ReactNode } from "react";

import "./Button.css";

type ButtonProps = {
  className?: string;
  green?: boolean;
  small?: boolean;
  [x: string]: any;
};

const Button: FunctionComponent<ButtonProps> = ({
  className,
  children,
  green,
  small,
  ...rest
}) => (
  <div
    className={
      "button button-create " +
      (green ? "green " : "") +
      (small ? "small " : "") +
      className
    }
    {...rest}
  >
    <span>{children}</span>
  </div>
);

export default Button;
