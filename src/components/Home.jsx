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
  // console.log("USERNAME", userProfile.lastName)  
  const [authenticated, setAuthenticated] = useState(props.authenticated);
  const [instrumentTables, setInstrumentTables] = useState([])
  
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
      autoClose: 1000,
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
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  /*ФИЛЬТР ИНСТРУМЕНТОВ*******************************************************************************************************************************/
  // async function updateUserSettingsByType(settings){
  //   // console.log("instrumentTables", instrumentTables)
  //   if(settings.type === "instruments"){
  //     let newUserSettings = []
  //     for(let f=0; f<instrumentTables.length; f++){
  //       if(instrumentTables[f].id === settings.id){
  //         newUserSettings.push(settings)
  //       }
  //       else{
  //         newUserSettings.push(instrumentTables[f])
  //       }
  //     }
  //     // console.log("UPD SET", newUserSettings)
  //     socket.send(JSON.stringify({
  //       commandType: "updateFinanceInstruments",
  //       userList: [userProfile.userId]
  //     }))
  //     setInstrumentTables(newUserSettings)
  //     let body = {
  //       instruments: newUserSettings,
  //       fixing: fixingTables,
  //       bids: bidsTables,
  //       deals: dealsTables,
  //       instrumentFilters: instrumentFilters
  //     }
  //     updateUserSettings(body)
  //   }
  //   else if(settings.type === "fixing"){
  //     let newUserSettings = []
  //     for(let f=0; f<fixingTables.length; f++){
  //       if(fixingTables[f].id === settings.id){
  //         newUserSettings.push(settings)
  //       }
  //       else{
  //         newUserSettings.push(fixingTables[f])
  //       }
  //     }
  //     // console.log("UPD SET", newUserSettings)
  //     socket.send(JSON.stringify({
  //       commandType: "updateFinanceInstrumentsFixing",
  //       userList: [userProfile.userId]
  //     }))
  //     setFixingTables(newUserSettings)
  //     let body = {
  //       instruments: instrumentTables,
  //       fixing: newUserSettings,
  //       bids: bidsTables,
  //       deals: dealsTables,
  //       instrumentFilters: instrumentFilters
  //     }
  //     updateUserSettings(body)
  //   }
  //   else if(settings.type === "bids"){
  //     let newUserSettings = []
  //     for(let f=0; f<bidsTables.length; f++){
  //       if(bidsTables[f].id === settings.id){
  //         newUserSettings.push(settings)
  //       }
  //       else{
  //         newUserSettings.push(bidsTables[f])
  //       }
  //     }
  //     // console.log("UPD SET", newUserSettings)
  //     socket.send(JSON.stringify({
  //       commandType: "updateActiveBids",
  //       userList: [userProfile.userId]
  //     }))
  //     setBidsTables(newUserSettings)
  //     let body = {
  //       instruments: instrumentTables,
  //       fixing: fixingTables,
  //       bids: newUserSettings,
  //       deals: dealsTables,
  //       instrumentFilters: instrumentFilters
  //     }
  //     updateUserSettings(body)
  //   }
  //   else if(settings.type === "deals"){
  //     let newUserSettings = []
  //     for(let f=0; f<dealsTables.length; f++){
  //       if(dealsTables[f].id === settings.id){
  //         newUserSettings.push(settings)
  //       }
  //       else{
  //         // console.log("NOT", instrumentTables[f])
  //         newUserSettings.push(dealsTables[f])
  //       }
  //     }
  //     // console.log("UPD SET", newUserSettings)
  //     socket.send(JSON.stringify({
  //       commandType: "updateDeals",
  //       userList: [userProfile.userId]
  //     }))
  //     setDealsTables(newUserSettings)
  //     let body = {
  //       instruments: instrumentTables,
  //       fixing: fixingTables,
  //       bids: bidsTables,
  //       deals: newUserSettings,
  //       instrumentFilters: instrumentFilters
  //     }
  //     updateUserSettings(body)
  //   }
  //   else if(settings.type === "instrumentFilters"){
  //     socket.send(JSON.stringify({
  //       commandType: "updateFinanceInstruments",
  //       userList: [userProfile.userId]
  //     }))
  //     setInstrumentFilters(settings.instrumentFilters)
  //     let body = {
  //       instruments: instrumentTables,
  //       fixing: fixingTables,
  //       bids: bidsTables,
  //       deals: dealsTables,
  //       instrumentFilters: settings.instrumentFilters
  //     }
  //     console.log("UPD SET", settings, body)
  //     updateUserSettings(body)
  //   }
  // }
  // async function updateUserSettings(){
  //   if(userProfile.settings === "instruments"){
  //   let newUserSettings = []
  //     for(let f=0; f<instrumentTables.length; f++){
  //       if(instrumentTables[f].id === userProfile.settings.id){
  //         newUserSettings.push(userProfile.settings)
  //       }
  //       else{
  //         newUserSettings.push(instrumentTables[f])
  //       }
  //     }
      
  //   let body = {
  //     instruments: newUserSettings,      
  //   }
  //   console.log("BODY", body)
  //   await fetch(
  //     kseRESTApi + "/api/users/UpdateUserSettings",
  //     {
  //       "headers": {"content-type": "application/json", "Authorization": "Bearer " + token},
  //       "method": "POST",
  //       "body": JSON.stringify(body)
  //     }
  //   )
  //   .then(response => response.json())
  //   .then(function(res){
  //     console.log("RES", res)
  //   })
  // }
  // }
  /***************************************************************************************************************************************************/
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
            <div 
              style={{
                fontFamily:'Roboto',
                fontSize:13,
                maxWidth:130,  
                color:'white',
                paddingRight:20
                }}
              >
              {userProfile.lastName + ' ' + userProfile.firstName.substring(0, 1) + '.' + userProfile.middleName.substring(0, 1) + '.'}
            </div>          
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
