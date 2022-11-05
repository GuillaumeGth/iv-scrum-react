import React, { useEffect, useState} from "react";
import Backlog from "../../types/Backlog";
import Team from "../../types/Team";
import './style.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import Api from "../../utils/Api";
import CircleProgressBar from "../CircleProgressBar";
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
type Props = {
    team: Team    
}
const TeamBoard : React.FC<Props> = ({team}) => {
    const [trelloCards, setTrelloCards] = useState<Array<any>>([]);
    const [tags, setTags] = useState<Record<string, any>>({});
    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchingLists, setFetchingLists] = useState<boolean>(false);    
    const [lists, setLists] = useState<Array<any> | null>(null);
    useEffect(() => {        
        getCards();
    });    
    const getBackLogDataSet = (data: Team) => {
        let filtered = data.backlogs?.reduce((prev:Array<Backlog>, cur: Backlog) => { 
            if (!prev.filter((b:Backlog) => new Date(b.date).toLocaleString().split(',')[0] === new Date(cur.date).toLocaleString().split(',')[0]).length)
            {
                prev.push(cur);
            }
            else{
                prev[prev.length -1] = cur;
            }
            return prev;
        }, []);
        filtered = filtered.sort((a: Backlog,b: Backlog) => {                        
            const bDate = new Date(b.date).getTime();
            const aDate = new Date(a.date);
            return aDate.getTime() - bDate;
        });
        
        const labels = filtered.reduce((prev: Array<string>, cur: Backlog) => {
            // const date = new Date(cur.date);
            const date = new Date(cur.date).toLocaleString().split(',')[0].split('/');   
            const str =  `${date[1]}/${date[0]}`
            prev.push(str);
            return prev;
        }, []);
        const blockings = filtered.reduce((prev: Array<number>, cur: Backlog) => {        
            prev.push(cur.blocking);
            return prev;
        }, []);
        const majors = filtered.reduce((prev: Array<number>, cur: Backlog) => {        
            prev.push(cur.major);
            return prev;
        }, []);
        const minors = filtered.reduce((prev: Array<number>, cur: Backlog) => {        
            prev.push(cur.minor);
            return prev;
        }, []);
    return {
        labels,
        datasets: [
        {
            label: 'Blockings',
            data: blockings,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Majors',
            data: majors,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Minors',
            data: minors,
            borderColor: 'rgb(107, 214, 54)',
            backgroundColor: 'rgba(107, 214, 54, 0.5)',
        },
        ],
    }
    } 
    const getRequestDiff = (data: Array<any>, days: number) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        let previousData: Backlog | null = null;
        let lastData: Backlog | null = null;
        data.forEach((e : Backlog) => {
            if (lastData == null)
            {
                lastData = e;
            }
            if (new Date(e.date).getTime() > new Date(lastData.date).getTime()){
                lastData = e;
            }
            const d = new Date(e.date).getTime();
            if (d > date.getTime()){
                previousData = e;
            }
        });
        if (!previousData) return 0;
        if (!lastData) return 0;
        previousData = previousData as Backlog;
        const totalPrevious  = previousData.minor + previousData.major + previousData.blocking;
        lastData = lastData as Backlog;
        const totalLast  = lastData.minor + lastData.major + lastData.blocking;
        console.log(previousData);
        let diff = (totalLast - totalPrevious).toString();
        let className = "diff";
        if (parseInt(diff) > 0){
            className += ' positive';
            diff = `+${diff}`;
        }
        else if (parseInt(diff) < 0){
            className += ' negative';
        }
        return (<span className={className}>{diff}</span>)
    }
    const [percentageDone, setPercentageDone] = useState<number>(0);
    const getLists = async (cards: any) => {
        if (lists) return lists;
        if (fetchingLists) return;        
        setFetchingLists(true);
        Api.call(`/1/boards/${team.trelloId}/lists?key=10e69760de5166baedbbf5349ee6a617&token=0e76f01f0aa92582ad6a4a1821f44a28781fdd4f1a373390b32c4daae6fd2d8e`,
        {
            host: 'https://api.trello.com',
            cors: false, 
            method: 'GET',
            callback: (data: Array<any>, cards: any) => {       
                const idDone = data.find(list => list.name.indexOf('Done') > -1).id;
                const doneCards: Array<any> = [];
                const tags: Record<string, any> = {}
                const names = cards.reduce((prev: Array<any>, current: any) => {
                    if (current.name[0] === '(')
                        prev.push(current.name);
                    if(current.idList === idDone)
                        doneCards.push(current);
                    if (current.labels.length){
                        if (!tags[current.labels[0].id]){                    
                            tags[current.labels[0].id] = {                            
                                name: current.labels[0].name,
                                color: current.labels[0].color,
                                cards: []
                            }                     
                        }
                        tags[current.labels[0].id].cards.push(current);
                    }                          
                    return prev;
                }, []);  
                const regExp = /\(([^)]+)\)/;
                for (const id in tags){
                    const tag = tags[id];
                    let total = 0;
                    let totalDone = 0;
                    tag.cards.forEach((card: any) => {
                        const matches = regExp.exec(card.name);
                        if (!matches) return;                    
                        total += (parseInt(matches[1]));   
                        if(card.idList === idDone){
                            totalDone += (parseInt(matches[1]));
                        }
                        tag.total = total;
                        tag.totalDone = totalDone;                
                    })
                };
                setTags(tags);
                let total = 0;
                names.forEach((name: string) => {
                    const matches = regExp.exec(name);
                    if (!matches) return;                    
                    total += (parseInt(matches[1]));               
                });    
                let totalDone = 0;
                doneCards.forEach((card: Record<string, any>) => {
                    const matches = regExp.exec(card.name);
                    if (!matches) return;                    
                    totalDone += (parseInt(matches[1]));               
                });
                setPercentageDone(Math.round((totalDone / total) * 100));
            },
            callbackParam: cards
        });
    }
    const getCards = async () => {    
        if (fetching) return;         
        if (trelloCards?.length)
            return trelloCards;
        setFetching(true);
        Api.call(`/1/boards/${team.trelloId}/cards?key=10e69760de5166baedbbf5349ee6a617&token=0e76f01f0aa92582ad6a4a1821f44a28781fdd4f1a373390b32c4daae6fd2d8e`,
        {
            method: 'GET',
            host: 'https://api.trello.com',
            cors: false,
            callback: (data: Array<any>) => {                                
                setFetching(false);
                setTrelloCards(data);
                getLists(data);                                                 
            }
        })                    
        return trelloCards;
    }
    console.log(tags)
    return ( 
    <div className="kpi flex row" key={team.id}>
        <div className="flex column">            
            <span className="name">{team.name}</span>
            <div>                         
                <Line
                options={{
                    responsive: true,
                    scales: {                                        
                        yAxes:{                                        
                            ticks:{                                                
                                color: 'white',                                                
                            }
                        },
                        xAxes:{                                        
                            ticks:{                                                
                                color: 'white',                                                
                            }
                        },
                    },
                    plugins: {                                        
                    legend: {
                        display: false,                                        
                    },  

                    },}}                                                       
                data={getBackLogDataSet(team)}
                    />                                    
            </div>                            
        </div>
        <div className="flex column">                                    
            <div>                                                         
                <span>Week</span>
                {getRequestDiff(team.backlogs as Array<any>, 7)}
            </div> 
            <div>                                                         
                <span>Month</span>
                {getRequestDiff(team.backlogs as Array<any>, 30)}
            </div>                            
        </div>   
        <div className="flex column center">
            <span>Sprint Progress</span>
            <CircleProgressBar value={percentageDone} />
        </div>
        <div className="flex column">            
            {Object.entries(tags).map((id: any) => {
                const tag = tags[id[0]];
                return (<div key={id[0]} className={`tag ${tag.color}`}>
                    <span className="label">{tag.name}</span>
                    <span className="percentage">{(tag.totalDone / tag.total) * 100 }%</span>
                </div>)
            })}
        </div>
    </div>
  );
}
export default TeamBoard;