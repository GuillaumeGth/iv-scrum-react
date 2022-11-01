import React, {FunctionComponent, useEffect, useRef, useState} from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import Team from "../../types/Team";
import Api from "../../utils/Api";
import './dashboard.css'
import Backlog from "../../types/Backlog";
import TeamBoard from "../../components/TeamBoard/TeamBoard";

const Dashboard : FunctionComponent = () => {
    const dispatch = useDispatch();   
    const teamStore = useSelector((state: RootState) => state.teams) as Record<string, any>;    
    const teams = teamStore.teams as Array<Team>;
    const [backlogData, setBacklogData] = useState<Array<Team> | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    useEffect(() => {        
        if (!backlogData && !isFetching){                        
            setIsFetching(true);       
            Api.call(`/backlog/all`, {method: 'GET', callback: 
            (data: any) => {                                    
                setBacklogData(data);
                setIsFetching(false);
            }});            
        }
    });       
return ( 
        <div id="flex column">            
            {backlogData && backlogData.map((data: Team) => {
                return (
                    <TeamBoard team={data}/>
            )})}
        </div>  
    );
}
export default Dashboard;