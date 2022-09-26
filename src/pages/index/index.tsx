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
import { setDevs, setDevTalked } from "../../redux/action";
const Index : FunctionComponent = () => {
    const dispatch = useDispatch();
    const [isPlaying, setIsPlaying] = useState<boolean>(false);    
    const [current, setCurrent] = useState<Dev | null>(null);    
    const [font, setFont] = useState<string | null>(null);    
    const [color, setColor] = useState<string | null>(null);    
    const devs = (useSelector((state: RootState) => state.devs) as Record<string, any>).devs;
    const pickHandler = () => {
        const fonts = ['ancient', 'romantice', 'magic-retro', 'xantegrode-signature', 'typewriter']
        const colors = ['green', 'yellow', 'orange', 'red', 'pink', 'blue', 'white'];
        if (!isPlaying){            
            setIsPlaying(true);
        }
        let stop = false;
        setTimeout(() => {
            stop = true;
        }, 3500);        
        let colorIndex = 0;
        const pickDevInterval = setInterval(() => {
            document.querySelectorAll('.dev.column li.selected').forEach(li => {
                li.classList.remove('selected')
            });
            const remainingDevs = [...devs].filter((dev: Dev) => !dev.talked && dev.here);
            let currentDev;
            do {
                const currentDevIndex = Common.getRandomInt(remainingDevs.length);
                currentDev = remainingDevs[currentDevIndex];
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
                if (currentDev)
                {                    
                    dispatch(setDevTalked(currentDev)); 
                }                                
            }
            
        }, 200);  
    }
    const resetHandler = () => {
        if (!isPlaying){            
            setIsPlaying(false);
        }
    }
  return ( 
    <div id="container">
            <div className="column">
                <div className="flex row space-evenly">                
                    <Teams />                                                   
                </div>            
                <div id="settings" className="flex row center">                                
                    <div id="actions">   
                        <Button id="btnPick" label="Pick" callback={pickHandler}/>
                        <Button id="btnReset" className="reset" label="Reset" callback={resetHandler}/>                                            
                    </div>
                </div>
                <Clock duration={60*15} isPlaying={isPlaying}/>
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