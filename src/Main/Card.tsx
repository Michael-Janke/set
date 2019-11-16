/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import "./Card.css";
import classNames from "classnames";
import ShapeSvg from "./Shape";
import { Fill, Color, Shape } from "../Model/Card";

interface CardProps extends React.PropsWithChildren<any> {
  className?: string;
}

const Card = ({ component: Component = "div", ...other }) => (
  <div>
    <ShapeSvg fill={Fill.Dotted} color={Color.Red} shape={Shape.Square} />
  </div>
);

export default Card;
