/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import "./Card.css";
import classNames from "classnames";

interface WrapperComponent {
  <C extends React.ElementType>(
    props: OwnProps<C> & React.ComponentProps<C>
  ): JSX.Element;
}

interface OwnProps<C> {
  className?: string;
  component?: C;
}

const Card: WrapperComponent = ({
  component: Component = "div",
  className,
  ...other
}) => <Component className={classNames("Card", className)} {...other} />;

export default Card;
