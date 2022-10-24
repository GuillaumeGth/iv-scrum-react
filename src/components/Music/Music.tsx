import React, {FunctionComponent} from "react";
import './music.css';
const Music : FunctionComponent = () => {
  return ( 
    <div className="music flex">        
        {/* <marquee className="dotted hidden">music sounds better with you</marquee> */}
        <div className="flex row player-actions">            
            <a href="./branches.html">
                <img width="90" src="./icons/delorean.png" id="cauchyStatusImg" className="delorean"/>
            </a>
            <img className="pause button" width="40"  height="40" src="./icons/pause.png" />
            <img className="play button" width="40" height="40" src="./icons/play.png" />
            <img className="next button" width="40" height="40" src="./icons/next.png" />
            <audio controls id="player">                                   
            </audio>            
        </div>                    
    </div>      
  );
}
export default Music;