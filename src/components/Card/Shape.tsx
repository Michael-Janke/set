import { Shape, Color, Fill } from "../../common/Card";
import React from "react";

interface ShapeSvgProps {
  shape: Shape;
  color: Color;
  fill: Fill;
}

const CrossHatch = ({
  color,
}: {
  color: React.SVGAttributes<SVGLineElement>["stroke"];
}) => (
  <defs>
    <pattern
      id={"pattern" + color}
      patternUnits="userSpaceOnUse"
      width="1.5"
      height="1.5"
      patternTransform="rotate(45)"
    >
      <line x1="0" y="0" x2="0" y2="1.5" stroke={color} strokeWidth="1.5" />
    </pattern>
  </defs>
);

export const colors: { [x in Color]: string } = {
  [Color.Green]: "#2e7d32",
  [Color.Purple]: "#5e35b1",
  [Color.Red]: "#c62828",
};

export default function ShapeSvg({ shape, color, fill }: ShapeSvgProps) {
  const paths: { [x in Shape]: string } = {
    [Shape.Wave]:
      "m59.599015,7.246131c0,2.658948 -0.693012,5.204796 -2.077927,7.639762c-1.348324,2.433857 -3.31426,4.437493 -5.898916,6.009798c-2.545848,1.573414 -5.523027,2.359567 -8.931536,2.359567c-2.021377,0 -4.062712,-0.318231 -6.122898,-0.954693c-2.021377,-0.674162 -4.623775,-1.704255 -7.807194,-3.090278c-3.145719,-1.422615 -5.467586,-2.415008 -6.9656,-2.977179c-1.498014,-0.598762 -2.865188,-0.898143 -4.100412,-0.898143c-1.423723,0 -2.640098,0.299381 -3.651341,0.898143c-1.011243,0.599871 -2.172176,1.535714 -3.4828,2.808638c-1.310624,1.274033 -2.321867,2.153326 -3.033285,2.640098c-0.674051,0.45018 -1.535382,0.674162 -2.583881,0.674162c-3.295521,0 -4.943225,-2.077927 -4.943225,-6.234889c0,-4.081562 1.516642,-7.789453 4.549927,-11.122562c3.070763,-3.332001 6.965157,-4.998556 11.684733,-4.998556c2.733239,0 5.167096,0.392522 7.301572,1.179783c2.135585,0.786153 5.336745,2.115626 9.605698,3.987313c4.306653,1.872795 7.20954,2.808638 8.707555,2.808638c1.422615,0 2.621248,-0.280531 3.594791,-0.842702c1.011243,-0.598762 2.134476,-1.496905 3.369701,-2.695539c1.274033,-1.236333 2.303017,-2.115626 3.090278,-2.640098c0.786153,-0.562171 1.703146,-0.842702 2.752088,-0.842702c3.29541,0 4.943115,2.096777 4.943115,6.291438l-0.000444,0z",
    [Shape.Round]:
      "m9.630955,0l40.602444,0l0,0c5.319036,0 9.630956,4.380615 9.630956,9.784376c0,5.403758 -4.311922,9.784372 -9.630956,9.784372l-40.602444,0l0,0c-5.31903,0 -9.630956,-4.380613 -9.630956,-9.784372c0,-5.403762 4.311926,-9.784376 9.630956,-9.784376z",
    [Shape.Square]:
      "m0,10.706962l29.905627,-10.706964l29.905697,10.706964l-29.905697,10.706964l-29.905627,-10.706964z",
  };
  const path = paths[shape];
  const fills: { [x in Color]: string | undefined } = {
    [Fill.Dotted]: "url(#pattern" + colors[color] + ") " + colors[color],
    [Fill.Filled]: colors[color],
    [Fill.None]: undefined,
  };
  return (
    <svg viewBox="-5 -5 70 30">
      {fill === Fill.Dotted && <CrossHatch color={colors[color]} />}
      <path
        stroke={colors[color]}
        strokeWidth={3}
        d={path}
        fill={fills[fill]}
        fillOpacity={fill === Fill.None ? 0 : 1}
      />
    </svg>
  );
}
