import React, {FC, FunctionComponent} from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
type Props = {
    duration: number;
    isPlaying: boolean;
}
const Clock : FC<Props> = ({duration, isPlaying}) => {
  return ( 
    <CountdownCircleTimer  
    isPlaying={isPlaying}  
    duration={duration}
    colors={[
        '#a36efa',
        '#d75ce0',
        '#fa4bc0',
        '#ff439d',
        '#ff4c79',
        '#ff5f57',
        '#ff7735',
        '#f58d0c',
        '#dba200',
        '#bcb300',
        '#97c213'
        ]}
    colorsTime={[60, 55, 48, 37, 26, 15, 6, 4, 3, 2]}

  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
  );
}
export default Clock;
