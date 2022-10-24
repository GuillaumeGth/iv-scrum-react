import React, {FunctionComponent, useEffect, useRef, useState} from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import Team from "../../types/Team";
import Api from "../../utils/Api";
import './dashboard.css'
import Backlog from "../../types/Backlog";
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
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

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
return ( 
        <div id="flex column">            
            {backlogData && backlogData.map((data: Team) => {
                return (
                    <div className="kpi flex row" key={data.id}>
                        <div id="flex column">            
                            <span className="name">{data.name}</span>
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
                                data={getBackLogDataSet(data)}
                                    />                                    
                            </div>                            
                        </div>
                        <div id="flex column">                                    
                        <div>                                                         
                                <span>Week</span>
                                {getRequestDiff(data.backlogs as Array<any>, 7)}
                            </div> 
                            <div>                                                         
                                <span>Month</span>
                                {getRequestDiff(data.backlogs as Array<any>, 30)}
                            </div>                            
                        </div>   
                    </div>
            )})}
        </div>  
    );
}
export default Dashboard;