/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import "./Card.css";
import { createUseStyles } from "react-jss";
import ShapeSvg from "./Shape";
import CardModel from "../Model/Card";

interface CardProps extends React.PropsWithChildren<any> {
  card: CardModel;
}

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    boxSizing: "border-box",
    backgroundColor: "white",
    willChange: "transform",
    borderRadius: "3%",
    padding: "10%",
    "& svg": {
      width: "100%"
    }
  }
});

const Card = ({ card }: CardProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {[0, ...Array(card.number)].map((_, i) => (
        <ShapeSvg
          key={i}
          fill={card.fill}
          color={card.color}
          shape={card.shape}
        />
      ))}
    </div>
  );
};

export default Card;
