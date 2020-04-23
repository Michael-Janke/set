import React from "react";
import { useTransition, animated } from "react-spring";
import "./Score.css";

export default function ({
  score,
  className = "",
  placeholder = "10",
}: {
  score: string | number;
  className?: string;
  placeholder?: string;
}) {
  const transitions = useTransition([score], null, {
    from: { transform: "translate3d(-50%,100%,0)", opacity: 0 },
    enter: { transform: "translate3d(-50%,0px,0)", opacity: 1 },
    leave: { transform: "translate3d(-50%,-100%x,0)", opacity: 0 },
  });
  return (
    <div className={"score " + className}>
      <div className="alibi">{placeholder}</div>
      {transitions.map(({ item, props }) => (
        <animated.div key={item} style={props} className="number">
          {item}
        </animated.div>
      ))}
    </div>
  );
}
