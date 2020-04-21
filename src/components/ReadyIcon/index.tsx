import React from "react";

import "./ReadyIcon.css";

const ReadyIcon = ({ ready }: { ready: boolean }) => {
  return (
    <span className={"ready-icon " + ["close", "checked"][ready ? 1 : 0]}>
      <span className="s1"></span>
      <span className="s2"></span>
      <span className="s3"></span>
    </span>
  );
};

export default ReadyIcon;
