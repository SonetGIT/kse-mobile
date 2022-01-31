import React, {useState, useEffect} from 'react';
import { IoArrowRedoCircleOutline } from 'react-icons/io5';
import { Grid, Toolbar } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import AppBar from "@material-ui/core/AppBar";
import Card from '@mui/material/Card';
import OnlineTime from "./OnlineTime"; //Онлайн время
import FinInstruments from './FinInstruments.jsx';
import ActiveBids from './ActiveBids.jsx';
import Deals from './Deals.jsx';
import Briefcase from './Briefcase.jsx';
import MoneyPositions from './MoneyPositions.jsx';
import BottomNavigation from './BottomNavigation.jsx';
import ConfigurationFile from '../configuration/ConfigurationFile.json';

export default function Home(props) {
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token, setToken] = useState(props.token);
  const [userProfile, setUserProfile] = useState(props.userProfile);  
  const [authenticated, setAuthenticated] = useState(props.authenticated);
  const [showMails, setShowMails] = useState(false)
  
  //Выход из ситемы
  function exitSystemClick(){
    localStorage.removeItem("token")
    props.setAuthenticated(false)
    props.setUserProfile({})
  }
  async function fetchDocList(docListApi){
    // console.log("API", kseRESTApi + docListApi)
    let docList = await fetch(kseRESTApi + docListApi, 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      return res.data
    })
    .catch(function (error) {
      console.log("Collecting docList error: ", error)
      return []
    })
    return docList
  }
  // Collect enumData using list
  async function getEnumDataByList(list){
    let enumData = {}
    for(let i=0; i<list.length; i++){
      let enumName = list[i].enumName
      let enumDef = list[i].enumDef
      // console.log("ENUM ITEM", enumName, enumDef)
      let enumValues = await getEnumValues(enumDef)
      enumData[enumName] = enumValues
    }
    return enumData
  }
  // Request Enum Data from API
  async function getEnumValues(enumDef){
    console.log("ENUM ITEM", enumDef)
    var newEnumValues = await fetch(
      kseRESTApi + ConfigurationFile.enumConfig[enumDef].apiName,
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      // console.log("EN RESP", res)
      let eData = res.data
      let newEnumData = []
      let dataToCollect = ConfigurationFile.enumConfig[enumDef].data
      for(let key=0; key<eData.length; key++){
        let newItem = {}
        for(let item in dataToCollect){
          if(item === "id"){
            newItem[item] = eData[key][ConfigurationFile.enumConfig[enumDef].data[item]]
          }
          else{
            let fullLetter = null
            for(let n=0; n<ConfigurationFile.enumConfig[enumDef].data[item].length; n++){
              let itemToAppend = ConfigurationFile.enumConfig[enumDef].data[item][n]
              if(itemToAppend === "-" || itemToAppend === " "){
                fullLetter += itemToAppend
              }
              else{
                let newLetter = eData[key][itemToAppend]
                // console.log("NEW LETTER", newLetter)
                if(fullLetter === null){
                  fullLetter = newLetter
                }
                else{
                  fullLetter = fullLetter + eData[key][itemToAppend]
                }
              }
            }
            newItem[item] = fullLetter
          }
        }
        newEnumData.push(newItem)
      }
      // var data = {
      //   name: enumName,
      //   data: newEnumData
      // }
      // console.log("EEENUM DATA: ", newEnumData)
      return newEnumData
    })
    .catch(function (error) {
      return console.log("Collecting enum data error: ", error)
    })
    // console.log("newEnumValues", newEnumValues)
    return newEnumValues
  }
  async function createEnumOptions(enums){
    // console.log("ENUMS", enums)
    let newEnumOptions = {}
    for(let key in enums){
      for (let i = 0; i<enums[key].length; i++){
        let options = [{
          "value": null,
          "label": "Пусто",
          "name" : key
        }]
        for (let d = 0; d < enums[key].length; d++) {
          options.push({
            "value": enums[key][d].id,
            "label": enums[key][d].label,
            "name": key
          })
        }
        newEnumOptions[key] = options
      }
    }
    return newEnumOptions
  }
  function callSuccessToast(text){
    toast(text, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  function callErrorToast(text){
    toast.error(text, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  /*ОТРИСОВКА*****************************************************************************************************************************************/
  return (
    <div style={{width:'100%', height:'100vh'}}>
      <AppBar style={{width:'100%', height:45, backgroundColor:'#ff7043'}}>
        <Grid 
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          style={{backgroundColor:'#ff7043'}}        
          >          
          <OnlineTime/>
        </Grid>
      </AppBar>
      <Briefcase
        kseRESTApi={kseRESTApi}
        token={token}
        getEnumDataByList={getEnumDataByList}
        createEnumOptions={createEnumOptions}
      />      
      <MoneyPositions
        kseRESTApi={kseRESTApi}
        token={token}
        getEnumDataByList={getEnumDataByList}
        createEnumOptions={createEnumOptions}
      />
      <FinInstruments 
        kseRESTApi={kseRESTApi} 
        token={token}
        userProfile={userProfile}
        getEnumDataByList={getEnumDataByList}
        createEnumOptions={createEnumOptions}
        callSuccessToast={callSuccessToast}
        callErrorToast={callErrorToast}
      />
      <ActiveBids 
        kseRESTApi={kseRESTApi} 
        token={token}
        callSuccessToast={callSuccessToast}
        callErrorToast={callErrorToast}
      />
      <Deals 
        kseRESTApi={kseRESTApi} 
        token={token}
      />
      <BottomNavigation
        kseRESTApi={kseRESTApi} 
        token={token}
        userProfile={userProfile}
        getEnumDataByList={getEnumDataByList}
        createEnumOptions={createEnumOptions}
        callSuccessToast={callSuccessToast}
        callErrorToast={callErrorToast}
        fetchDocList={fetchDocList}
        exitSystemClick={exitSystemClick}
      >
      </BottomNavigation>   
      {/* Вызов toast */}
      <ToastContainer/>      
    </div>
    
  );
}
