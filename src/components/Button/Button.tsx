import React from "react";
type Props = {
    id?: string; 
    label: string;   
    className?: string;
    callback: React.MouseEventHandler<HTMLButtonElement>;
}
const Button :  React.FC<Props> = ({id, label, className, callback}) => {
  return ( 
    <button id={id} className={`btn ${className}`} onClick={callback}>
        <span>{label}</span>
    </button> 
  );
}
export default Button;