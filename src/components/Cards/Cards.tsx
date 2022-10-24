import { debug } from "console";
import React, {FunctionComponent, useEffect, useState} from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import Dev from "../../types/Dev";
import Team from "../../types/Team";
import Api from "../../utils/Api";
import Card from "../Card";
const Cards : FunctionComponent = () => {     
    const [trelloCards, setTrelloCards] = useState<Array<any>>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchingLists, setFetchingLists] = useState<boolean>(false);
    const teams = (useSelector((state: RootState) => state.teams) as Record<string, any>).teams;
    const currentDev = teams?.devs?.find((d: Dev) => d.speaking);
    const [lists, setLists] = useState<Array<any> | null>(null);
    useEffect(() => {        
        getCards();
        getLists();
    });    
    const getTeamId = () => {
        return teams.find((t: Team) => t.selected)?.trelloId;
    }
    const getLists = async () => {
        if (lists) return lists;
        if (teams === null || fetchingLists) return;        
        setFetchingLists(true);
        Api.call(`/1/boards/${getTeamId()}/lists?key=10e69760de5166baedbbf5349ee6a617&token=0e76f01f0aa92582ad6a4a1821f44a28781fdd4f1a373390b32c4daae6fd2d8e`,
        {
            host: 'https://api.trello.com',
            cors: false, 
            method: 'GET',
            callback: (data: Array<any>) => {        
                setLists(data);
                setFetchingLists(false);
            }
        });             
              
    }
    const getCards = async () => {    
        if (teams === null || fetching) return;         
        if (trelloCards?.length)
            return trelloCards;
        setFetching(true);
        Api.call(`/1/boards/${getTeamId()}/cards?key=10e69760de5166baedbbf5349ee6a617&token=0e76f01f0aa92582ad6a4a1821f44a28781fdd4f1a373390b32c4daae6fd2d8e`,
        {
            method: 'GET',
            host: 'https://api.trello.com',
            cors: false,
            callback: (data: Array<any>) => {                                
                setFetching(false);
                setTrelloCards(data);                                                        
            }
        })                    
        return trelloCards;
    }
    const getCurrentCards = () => {
        if (!lists) return [];
        const list = lists?.find(li => li.name.indexOf('In progress') > -1);        
        if (!currentDev) {
            return trelloCards.filter(c => c.idList === list.id);         
        }
        return trelloCards.filter(e => e.idMembers.indexOf(currentDev.trello) > -1); 
    }
    return ( 
        <div id="cards">
            {trelloCards && 
            getCurrentCards().map(card => <Card key={card.id} url={card.shortUrl} desc={card.name} status={lists?.find(l => l.id === card.idList).name}/>)}
        </div>   
    );
}
export default Cards;