import React, {FunctionComponent, useEffect, useState} from "react";
import Team from "../../types/Team";
import Api from "../../utils/Api";
import Devs from "../Devs";
import { useDispatch } from "react-redux";
import { setDevs } from "../../redux/action";

const Teams : FunctionComponent = () => {
    const [teams, setTeams] = useState<Array<Team> | null>(null);
    const dispatch = useDispatch();
    const getTeamsCallback = (data: any) => {
        data[0].selected = true;        
        setTeams(data);
    }
    useEffect(() => {
        if (!teams){
            Api.call('/team', {method: 'GET', callback: getTeamsCallback})
        }            
     });     
    const onClickHandler = (e: React.MouseEvent) => {
        if (!teams) return;
        const target = e.target as HTMLElement;
        const tab = target.closest('.tab');
        const teamId = tab?.getAttribute('data-team-id');  
        const newTeams = [...teams];    
        newTeams?.forEach(t => t.selected = t.id === teamId);
        dispatch(setDevs(null));
        setTeams(newTeams);
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