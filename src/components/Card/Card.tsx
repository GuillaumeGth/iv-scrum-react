import React, {FunctionComponent, useEffect, useState} from "react"
type Props = {
    desc: string;
    status: string;
    url: string;
}
const Card : React.FC<Props> = ({desc, status, url}) => {    
    return (    
        <div className="card">
            <span className="ribbon">
                {status}
            </span>
            <a className="link" 
                href={url} target="blank">
                    {desc}
            </a>
            <div className="status"></div>
        </div>     
    );
}
export default Card;