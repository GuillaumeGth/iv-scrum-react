import React, {FC} from "react";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
type Props = {
    duration: number;    
}

const Clock : FC<Props> = ({duration}) => {
  return ( 
    <FlipClockCountdown to={new Date().getTime() + 15 * 60 * 1000 } />
  );
}
export default Clock;
