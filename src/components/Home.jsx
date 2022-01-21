import React, {useState, useEffect} from 'react';
import { IoArrowRedoCircleOutline } from 'react-icons/io5';
import { Grid } from '@material-ui/core';
import OnlineTime from "./OnlineTime"; //Онлайн время
import FinInstruments from './FinInstruments.jsx';
import ActiveBids from './ActiveBids.jsx';
import Deals from './Deals.jsx';
import Briefcase from './Briefcase.jsx';
import MoneyPositions from './MoneyPositions.jsx';
import OrderBuy from './OrderBuy.jsx';
import OrderSell from './OrderSell.jsx';
import ConfigurationFile from '../configuration/ConfigurationFile.json';
import { ToastContainer, toast } from 'react-toastify';

export default function Home(props) {
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token, setToken] = useState(props.token);
  const [userProfile, setUserProfile] = useState(props.userProfile);
  const [showOrderBuy, setShowOrderBuy] = useState(false)
  const [showOrderSell, setShowOrderSell] = useState(false)
  
  //Выход из ситемы
  function exitSystemClick(){
    localStorage.removeItem("token")
    props.setAuthenticated(false)
    props.setUserProfile({})
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
      <Grid 
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        style={{backgroundColor:'#ff7043'}}
       >
        {/* z */}
        <Grid item xs={4}>
        </Grid>
        <Grid item xs={5}>
          <OnlineTime/>
        </Grid>
        <Grid 
          item xs={1}>
          <IoArrowRedoCircleOutline
            style={{paddingTop:4, marginRight:4, color:'white'}}
            size='22px'
            onClick={()=>exitSystemClick()}
          />
        </Grid>          
      </Grid>      
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
      {showOrderBuy === true &&
        <OrderBuy
          // VARS
          kseRESTApi={props.kseRESTApi}
          token={props.token}
          userProfile={props.userProfile}
          // FUNCTIONS
          setShowOrderBuy={setShowOrderBuy}
          getEnumDataByList={getEnumDataByList}
          createEnumOptions={createEnumOptions}
          callSuccessToast={callSuccessToast}
          callErrorToast={callErrorToast}
        />
      }
      {showOrderSell === true &&
        <OrderSell
          kseRESTApi={props.kseRESTApi}
          token={props.token}
          userProfile={props.userProfile}
          setShowOrderSell={setShowOrderSell}
          getEnumDataByList={getEnumDataByList}
          createEnumOptions={createEnumOptions}
          callSuccessToast={callSuccessToast}
          callErrorToast={callErrorToast}
        />
      }
      {/* Вызов toast */}
      <ToastContainer/>
    </div>
  );
}
