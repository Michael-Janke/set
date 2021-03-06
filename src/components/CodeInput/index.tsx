import React, { useEffect } from "react";
import "./CodeInput.scss";
import { GAME_ID_CHARACTERS, GAME_ID_LENGTH } from "common/gameStatus";

export const codeFilter = (code: string) =>
  code
    .toUpperCase()
    .replace(RegExp(`[^${GAME_ID_CHARACTERS}]`, "g"), "")
    .slice(0, GAME_ID_LENGTH);

export default function CodeInput({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter: (() => void) | undefined;
}) {
  useEffect(() => {
    const updateCode = () => onChange(codeFilter(window.location.hash));
    window.addEventListener("hashchange", updateCode, false);
    return () => {
      window.removeEventListener("hashchange", updateCode);
    };
  }, [onChange]);

  useEffect(() => {
    onChange(codeFilter(window.location.hash));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <input
      className="codeInput"
      onFocus={() => onChange("")}
      onKeyDown={(event) => event.keyCode === 13 && onEnter && onEnter()}
      maxLength={GAME_ID_LENGTH}
      value={codeFilter(value)}
      onChange={(event) => onChange(codeFilter(event.target.value))}
      autoCorrect="off"
      spellCheck={false}
    />
  );
}
