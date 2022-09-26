import React, {FunctionComponent, useEffect, useState} from "react";
import Api from "../../utils/Api";
const Cards : FunctionComponent = () => {     
//      fetch(`${apiUrl}/team`, 
// {
//     method: 'GET',
//     headers: {
//         'Accept': 'application/json'        
//     }
// })
// .then(r => r.json())
// .then(ts => {    
//     promises = [];
//     for(t of ts){
//         t.devs = [];
//         promises.push(
//             new Promise((resolve, reject) => {
//                 fetch(`${apiUrl}/user/team/${t.id}`,
//                 {
//                     method: 'GET',
//                     headers: {
//                         'Accept': 'application/json'        
//                     }
//                 })
//                 .then(res => resolve(res))
//                 .catch(e => {
//                     reject(e);
//                 })
//             })
//         );
//     }
//     Promise.all(promises).then((res) => {
//         promises = [];
//         for(r of res){
//             promises.push(new Promise((resolve) => {
//                 resolve(r.json());
//             }));
//         }
//         Promise.all(promises)
//             .then(data => {
//                 for (d of data){
//                     for(dev of d){
//                         const team = ts.find(t => t.id === dev.team);
//                         team.devs.push(dev);
//                     }
//                 }
//                 teams = ts;
//                 init();
//             });        
//     })
// });
    
    return ( 
        <div id="cards">
        </div>   
    );
}
export default Cards;