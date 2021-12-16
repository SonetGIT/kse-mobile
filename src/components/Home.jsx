import React, {useState, useEffect} from 'react';
import { IoArrowRedoCircleOutline } from 'react-icons/io5';
import { Grid } from '@material-ui/core';
import OnlineTime from "./OnlineTime"; //Онлайн время
import FinInstruments from './FinInstruments.jsx';
import ActiveBids from './ActiveBids.jsx';
import Deals from './Deals.jsx';

export default function Home(props) {
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token, setToken] = useState(props.token);
  
  //Выход из ситемы
  function exitSystemClick(){
    localStorage.removeItem("token")
    props.setAuthenticated(false)
    props.setUserProfile({})
  } 
  
  /*ОТРИСОВКА*****************************************************************************************************************************************/
  return (
    <div style={{border:'groove 2px #1565c0', width:'100%', height:'100vh'}}>
      <Grid 
        container
        direction='row'
        justifyContent='flex-end'
        alignItems='center'
        >
          <OnlineTime/>
          <IoArrowRedoCircleOutline
            style={{paddingTop:2, paddingBottom:2, marginRight:6, color:'#1266F1'}}
            size='22px'
            onClick={()=>exitSystemClick()}
          />
      </Grid>
      <FinInstruments 
        kseRESTApi={kseRESTApi} 
        token={token}
      />
      <ActiveBids 
        kseRESTApi={kseRESTApi} 
        token={token}
      />
      <Deals 
        kseRESTApi={kseRESTApi} 
        token={token}
      />
    </div>
  );
}
