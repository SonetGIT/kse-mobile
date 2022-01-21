import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Header from './components/Header.jsx'
import Authentication from './components/Authentication.jsx'
import Home from './components/Home.jsx';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [token, setToken] = useState(null);
  // wsEndpoint - IP адрес сокета, для обмена данными с клиентом
  const [wsEndpoint] = useState("ws://192.168.2.109:3120") //Local
  const [kseRESTApi] = useState("http://192.168.2.150:5002") //Local KFB main REST

  // const [ip] = useState(window.location.hostname) //Server KFB main REST IP
  // const [wsEndpoint] = useState("ws://"+ ip +":3120") //WS Server
  // const [kseRESTApi] = useState("http://"+ ip +":5002") //Server KFB main REST

  function authenticate(profile, token){
    setUserProfile(profile)
    setToken(token)
    setAuthenticated(true)
  }
  
  return (
    // <Home></Home>
    authenticated === false ?
    <div style={{backgroundColor:'#f5f5f5', paddingBottom:40, width:'100%', height:'100vh'}}>
    <Header/>
    <Authentication
    kseRESTApi={kseRESTApi}
    authenticate={authenticate}
    />
    </div>
    :
    <Grid container>
      <Grid item xs={12}>
        <Home
          // VARS
          wsEndpoint={wsEndpoint}
          kseRESTApi={kseRESTApi}
          userProfile={userProfile}
          token={token}
          // FUNCTIONS
          setAuthenticated={setAuthenticated}
          setUserProfile={setUserProfile}
        /> 
      </Grid>
    </Grid>
  );
}