/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import "./Card.css";
import { createUseStyles } from "react-jss";
import ShapeSvg from "./Shape";
import { Fill, Color, Shape, Number } from "../Model/Card";

interface CardProps extends React.PropsWithChildren<any> {
  className?: string;
  style: React.HTMLAttributes<any>["style"];
}

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    boxSizing: "border-box",
    backgroundColor: "white",
    width: 300,
    height: 450,
    willChange: "transform",
    borderRadius: 10,
    padding: "5%",
    "& svg": {
      width: "100%"
    }
  }
});

const Card = ({ style }: CardProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={style}>
      {[0, ...Array(Number.One)].map((_, i) => (
        <ShapeSvg
          key={i}
          fill={Fill.Dotted}
          color={Color.Red}
          shape={Shape.Square}
        />
      ))}
    </div>
  );
};

export default Card;
