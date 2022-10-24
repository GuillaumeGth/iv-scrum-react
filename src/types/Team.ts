import Dev from "./Dev";

type Team = {
    id: string; 
    name: string;
    selected: boolean;
    trelloId: string;  
    devs?: Array<Dev>;
    backlogs?: Record<any, any>;
  };
export default Team;