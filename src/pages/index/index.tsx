import React, {FunctionComponent, useState} from "react";
import Clock from "../../components/Clock";
import Cards from "../../components/Cards";
import Music from "../../components/Music";
import Teams from "../../components/Teams";
import './index.css'
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import Common from "../../utils/common";
import Dev from "../../types/Dev";
import Team from "../../types/Team";
const Index : FunctionComponent = () => {
    const dispatch = useDispatch();
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);    
    const [current, setCurrent] = useState<Dev | null>(null);    
    const [font, setFont] = useState<string | null>(null);    
    const [color, setColor] = useState<string | null>(null);    
    const teams = (useSelector((state: RootState) => state.teams) as Record<string, any>)
                    .teams;
    const devs = (teams?.find((t: Team) => t.selected) as Team)?.devs;
    const stopDevTimer = () => {
        const endDate = new Date();
        if (!startTime || !current) return;
        const distance = endDate.getTime() - startTime?.getTime();                    
        const distanceString = Common.dateTostring(distance);     
        console.log(distanceString); 
        current.speakingTime = distanceString;
        // dispatch(setDev(current));   
    }    
    const pickHandler = () => {
        const fonts = ['ancient', 'romantice', 'magic-retro', 'xantegrode-signature', 'typewriter']
        const colors = ['green', 'yellow', 'orange', 'red', 'pink', 'blue', 'white'];
        if (!isPlaying){            
            setIsPlaying(true);
        }
        else{
            stopDevTimer();
        }
        let stop = false;

        if (!devs) return;
        const remainingDevs = [...devs].filter((dev: Dev) => !dev.talked && dev.here);
        if (!remainingDevs.length) return;
        setTimeout(() => {
            stop = true;
        }, 3500);        
        let colorIndex = 0;
        const pickDevInterval = setInterval(() => {                           
            let currentDev;
            do {
                const currentDevIndex = Common.getRandomInt(remainingDevs.length);
                currentDev = {...remainingDevs[currentDevIndex]};
            } while (currentDev.id === current?.id)
            setCurrent(currentDev);                        
            const fi = Common.getRandomInt(fonts.length);
            const f = fonts[fi];    
            setFont(f);       
            setColor(colors[colorIndex]);            
            colorIndex++;  
            if (colorIndex === colors.length){
                colorIndex = 0;
            }                             
            if (stop){                                        
                clearInterval(pickDevInterval);
                stop = false;
                new Date();
                if (currentDev)
                {        
                    currentDev.talked = true;            
                    currentDev.speaking = true;
                    // dispatch(setDev(currentDev));
                }    
                setStartTime(new Date());                            
            }
            
        }, 200);  
    }
    const resetHandler = () => {
        setIsPlaying(false);            
        setCurrent(null);
        if (!devs) return;
        devs.forEach(dev => {
            const newDev = {...dev};
            newDev.speakingTime = undefined;
            // dispatch(setDev(newDev));
        }) 
        
    }
  return ( 
    <div id="container">
            <div className="column">
                <div className="flex row space-evenly">                
                    <Teams onChange={resetHandler}/>                                                   
                </div>            
                <div id="settings" className="flex row center">                                
                    <div id="actions">   
                        <Button id="btnPick" label="Pick" callback={pickHandler}/>
                        <Button id="btnReset" className="reset" label="Reset" callback={resetHandler}/>                                            
                    </div>
                </div>
                {isPlaying 
                && <Clock duration={60*15}/>}
                
            </div> 
            <div className="column">
                <div id="infoArea">
                    <div id="currentDevInfo">
                        <span id="txtDevCurrent" data-font={font} data-color={color}>{current?.name}</span>                
                    </div>
                </div>                   
            </div> 
            <div className="flex column info">
                <Cards />  
            </div>
            <Music />
        </div>    
  );
}
export default Index;