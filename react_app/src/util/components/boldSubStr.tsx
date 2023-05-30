import React from "react";

type TProps = {
  str: string;
  subStr: string;
};
const BoldSubStr = (props: TProps): JSX.Element => {
  const { str, subStr } = props;
  const i = str.toLowerCase().indexOf(subStr.toLowerCase());
  if (i < 0) return <>{str}</>;
  return (
    <>
      {str.slice(0, i)}
      <b>{str.slice(i, i + subStr.length)}</b>
      {str.slice(i + subStr.length)}
    </>
  );
};

export default BoldSubStr;
