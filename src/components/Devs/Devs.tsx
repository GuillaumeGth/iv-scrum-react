import React, { useEffect } from "react";
import { setDevs } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";

import Team from "../../types/Team";
import Api from "../../utils/Api";
import './devs.css'
import Dev from "../../types/Dev";
import { debug } from "console";
type Props = {
    team: Team    
}
const Devs :  React.FC<Props> = ({team}) => {
    const devs = (useSelector((state: RootState) => state.devs) as Record<string, any>).devs as Array<Dev>;
    const dispatch = useDispatch();
    const getDevsCallback = (data: Array<Dev>) => {      
        data.forEach(dev => dev.talked = false);
        dispatch(setDevs(data));    
    } 
    useEffect(() => {
        if (!team.selected) return;
        if (!devs){
            Api.call(`/user/team/${team.id}`, {method: 'GET', callback: getDevsCallback});           
        }            
     });     
    if (!devs) return <></>;
    return (           
        <ul className={`dev column ${team.selected ? '': 'hidden'}`}> 
        {            
            devs && devs.map((dev: Dev) => {                
                return <li key={dev.id} data-user-id={dev.id} className={`${(dev.talked ? "selected" : "")}`}>
                        <div className="label">
                            <label 
                                className={`name-label`}>   
                                {dev.name}
                            </label>
                            {/* <img src="https://trello-members.s3.amazonaws.com/5770de0b7cc5c29c20e1c935/4a3099f21b978a18aa8af22a0ca02b7e/50.png">                         */}
                        </div>
                        <input value={dev.name} 
                            id={dev.name} 
                            data-user={dev.id} 
                            type="checkbox" 
                            checked={dev.here} 
                            onChange={() => {}}></input>
                    </li>
            })
        }     
        </ul>      
  );
}
export default Devs;