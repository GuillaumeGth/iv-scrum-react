import React, {FunctionComponent, useEffect, useState} from "react";
import Team from "../../types/Team";
import Api from "../../utils/Api";
import Devs from "../Devs";
import { useDispatch, useSelector } from "react-redux";
import { setDevs, setTeams } from "../../redux/action";
import { RootState } from "../../redux/reducer";
type Props = {
    onChange: Function;
}
const Teams : React.FC<Props> = ({onChange}) => {
    const teams = (useSelector((state: RootState) => state.teams) as Record<string, any>).teams as Array<Team>;
    const dispatch = useDispatch();
    const getTeamsCallback = (data: any) => {
        data[0].selected = true;                
        dispatch(setTeams(data));
    }
    useEffect(() => {
        if (!teams){
            Api.call('/team', { method: 'GET', callback: getTeamsCallback})
        }            
     });     
    const onClickHandler = (e: React.MouseEvent) => {
        if (!teams) return;
        const target = e.target as HTMLElement;
        const tab = target.closest('.tab');
        const teamId = tab?.getAttribute('data-team-id');  
        const newTeams = teams.reduce((prev: [], cur: any) => {
            const t = {...cur};
            t.selected = t.id === teamId;
            prev.push({...t} as never);
            return prev;
        }, [])        
        dispatch(setTeams(newTeams));
        dispatch(setDevs(null));      
        if (onChange){
            onChange();
        }
    }
  return ( 
    <div className="flex column team">
        <ul className="tabs">
            {teams && teams.map((t: Team) => {                    
                    return <li 
                        onClick={onClickHandler} 
                        key={t.id} data-team-id={t.id} 
                        data-trello-id={t.trelloId} 
                        className={`tab ${t.selected ? "selected" : ""}`}>
                            <span>{t.name}</span>
                        </li>
                })}
                
        </ul>
        {teams && teams.map((t: Team, index: number) => 
            <Devs key={`devs${t.id}`} team={t}/>
            )}        
    </div>       
  );
}
export default Teams;