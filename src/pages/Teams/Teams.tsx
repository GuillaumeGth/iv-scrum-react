import React, {FunctionComponent, useEffect, useState} from "react";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import './teams.css';
import Team from "../../types/Team";
import Api from "../../utils/Api";
import { setTeams } from "../../redux/action";
import Dev from "../../types/Dev";
const Teams : FunctionComponent = () => {
    const dispatch = useDispatch();   
    const teamStore = useSelector((state: RootState) => state.teams) as Record<string, any>;
    const teams = teamStore.teams as Array<Team>;
    const [isFetching, setIsFetching] = useState(false);
    const [isFetchingDevs, setIsFetchingDevs] = useState<Array<string>>([]);
    const getTeamsCallback = (data: any) => {      
        setIsFetching(false);               
        dispatch(setTeams(data));
    }
    useEffect(() => {        
        if (!teams && !isFetching){            
            setIsFetching(true);            
            Api.call('/team', { method: 'GET', callback: getTeamsCallback})
        }
        else{
            teams?.forEach((team: Team) => {                
                if (isFetchingDevs.findIndex(t => t === team.id) === -1){
                    setIsFetchingDevs([...isFetchingDevs, team.id]);
                    Api.call(`/user/team/${team.id}?newUser=true`, 
                    {
                        method: 'GET', 
                        callback: (data: any) => {
                            const newTeams = [...teams];                            
                            const index = newTeams.findIndex(t => t.id === team.id);                            
                            newTeams[index].devs = data;
                            dispatch(setTeams(newTeams))                     
                        }
                    }); 
                }                          
            })
        }
    });
  return ( 
    <div id="container">
        <div className="flex column content">
            <div className="flex row teams">
                {teamStore.teams && teams.map((team: Team) => {
                    return (
                        <div key={team.id} data-team="2b139375-8dda-40ae-94d9-c4d58713ac91" className="team">
                            <div>
                                <span className="title">{team.name}</span>
                                <button className="add" type="button"><i className="fa-solid fa-user-plus"></i></button>
                            </div>
                            <table>
                                <>
                                <thead>   
                                    <tr>
                                        <th>name</th>
                                        <th>trigram</th>
                                        <th>trello</th>
                                        <th>here</th>
                                    </tr>                                                                                                         
                                </thead>    
                                {team.devs && team.devs.map((dev: Dev) => {
                                    <tr key={dev.id} data-dev-id={dev.id}>
                                        <td><input type="text" data-property="name" value={dev.name} /></td>
                                        <td><input type="text" size={5} data-property="trigram" value={dev.trigram}/></td>
                                        <td>
                                            <select data-property="trello">
                                                <option value="5dd3f667cfe7b67ee3695081">Anaïs POULET</option>
                                                <option value="58480f8e35511bf7f82b961a">Guillaume Zarb</option>
                                                <option value="61483b5e4b18e97915fa94b9">Jose Miguel</option>
                                                <option value="5770de0b7cc5c29c20e1c935">Julien Lainé</option>
                                                <option value="571f321e3d0918a2cde3a2a8">MDD</option>
                                                <option value="5c7fc4f442826f14c0a7e497">Rémi</option>
                                                <option value="62a73ac1eeaf9f117353911a">Safi Mouhamad</option>
                                                <option value="615488db3da53285d95402dc">Samuel Caillerie</option>
                                                <option value="59b02122d3bc2d40e1a1ecb8">Yann Gremillon</option>
                                                <option value="61c205b702268157e004b923">jkl</option>
                                                <option value="59b2635100bc9d3ead969dc9">mbo</option>
                                                <option value="62c6e09038830279d6e0e389">tsn</option>
                                            </select></td>
                                        <td><input type="checkbox" data-property="here" value={dev.here.toString()} /></td>
                                        <td><button><i className="fa-solid fa-trash-can"></i></button></td>
                                    </tr>
                                })}                                        
                                </>                                                    
                            </table>
                        </div>    
                    );
                })}
            </div>
            <div className="new-team flex row">
                <Button callback={() => {}} label="Add Team"/>
            </div>
        </div>
    </div>  
  );
}
export default Teams;