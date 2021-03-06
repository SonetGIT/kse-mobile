import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from 'react-select'; // https://react-select.com/home
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import ruLocale from 'date-fns/locale/ru';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextareaAutosize from '@mui/material/TextareaAutosize';
// Icons
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
// CUSTOM COMPONENTS
import ConfigurationFile from "../configuration/ConfigurationFile.json";
// Library
import 'react-toastify/dist/ReactToastify.css';
import "../styles/generalStyles.css"
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import { IoIosCloseCircleOutline } from 'react-icons/io';
var moment = require('moment');

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: '90%',
    borderRadius: "7px",
    border: '1px solid #d7ccc8',
    boxShadow: theme.shadows[1],
    padding: 3,
    fontFamily:'Roboto',
    fontSize:12,
    background:'#FFFAFA'
  }
}))
function getModalStyle() {
  const top = 7;
  const left = 5;
  return {
    top: `${top}%`,
    left: `${left}%`,
    zIndex:20
  };
}

function FloatFormat(props){
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
      decimalSeparator={"."}
      thousandSeparator={" "}
      isNumericString
    />
  )
}
FloatFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}
function IntegerFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={" "}
      isNumericString
    />
  );
}
IntegerFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

//Home(props) - ???????????????? ???????????????????? ???? ???????????????? App.js 
export default function OrderSell(props) {
  const classes = useStyles()
  const [kseRESTApi] = useState(props.kseRESTApi) //Local KFB main REST
  const [token] = useState(props.token)
  const [userProfile] = useState(props.userProfile)
  const [updateState, setUpdateState] = useState(false)
  const [enumData, setEnumData] = useState({})
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [modalStyle] = useState(getModalStyle)
  const [bidType, setBidType] = useState("limited")
  // FIELDS
  const [lots, setLots] = useState([])
  const [fieldValue, setFieldValue] = useState({
    tradingAccount: null,
    organizationId: userProfile.organization.id,
    financeInstrument: null,
    amountOfLots: 0,
    amountOfLotsStep: 1,
    priceForInstrument: 100,
    priceForInstrumentStep: 1,
    amountOfInstrument: 1,
    amountOfInstrumentStep: 1,
    expiredAt: null,
    fullRequired: false,
  })

  useEffect(async()=>{
    console.log("ORDER SELL PROPS", props)
    let enumDataToCollect = [
      {enumName: "financeInstrument", enumDef: "3e819d7e-25d0-4a04-a3ff-092fd348a375"},
      {enumName: "tradingAccount", enumDef: "c324d86f-3a3b-43b2-9514-d983b2982794"},
      {enumName: "organizationId", enumDef: "5b78d9dd-821d-4c6a-a00a-3af85224fbc4"},
    ]
    let enums = await props.getEnumDataByList(enumDataToCollect)
    // console.log("BUY ENUMS", enums)
    setEnumData(enums)
    let eOpts = await props.createEnumOptions(enums)
    setEnumOptions(eOpts)
    let n = "organizationId"
    for(let d=0; d<enums[n].length; d++){
      if(enums[n][d].id === fieldValue.organizationId){
        setSelectedOptions({...selectedOptions, [n]: {"value": enums[n][d].id, "label": enums[n][d].label, "name" : n}})
      }
    }
  },[])
  function swAllert(text, icon){
    return(
      swal({
        text: text,
        icon: icon,
        buttons: {ok: "????"},
      })
    )
  }
  // random UUID generator
  function getUUID(){
    return uuidv4()
  }
  // INPUT HANDLERS
  // SELECT
  function handleSelectChange(option){
    setSelectedOptions({...selectedOptions, [option.name]: option})
    setFieldValue({...fieldValue, [option.name]: option.value})
    console.log("OPT", option)
  }
  // INT
  const handleIntChange = (event) => {
    console.log("EVENT", event.target.name, event.target.value)
    if(event.target.value !== ""){
      let stringNum = event.target.value.toString().replace(/ /g,'')
      let int = parseInt(stringNum)
      setFieldValue({ ...fieldValue, [event.target.name]: int })
    }
    else{
      setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
    }
  }
  function handleDateTimeChange(time, name) {
    // console.log("TIME", time, name)
    setFieldValue({ ...fieldValue, [name]: time })
  }
  function handleCheckboxChange(event){
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked })
  }  
  function add(name, step){
    let newPrice = fieldValue[name] + fieldValue[step]
    setFieldValue({ ...fieldValue, [name]: newPrice})
    // console.log("NEW PRICE", newPrice)
  }
  function reduce(name, step){
    let newPrice = fieldValue[name] - fieldValue[step]
    setFieldValue({ ...fieldValue, [name]: newPrice})
    // console.log("NEW PRICE", newPrice)
  }
  function addAmountOfInstrument(){
    let newPrice = fieldValue["amountOfInstrument"] + fieldValue["amountOfInstrumentStep"]
    setFieldValue({ ...fieldValue, ["amountOfInstrument"]: newPrice})
  }
  function reduceAmountOfInstrument(){
    let newPrice = fieldValue["amountOfInstrument"] - fieldValue["amountOfInstrumentStep"]
    setFieldValue({ ...fieldValue, ["amountOfInstrument"]: newPrice})
  }
  async function sendOrder(){
    if(fieldValue.tradingAccount !== null){
      if(fieldValue.financeInstrument !== null){
        let expire = fieldValue.expiredAt !== null ? moment(fieldValue.expiredAt).format() : null
        let body = {
          "organizationId": fieldValue.organizationId,
          "financeInstrumentId": fieldValue.financeInstrument,
          "accountId": fieldValue.tradingAccount,
          "bidDirection": 1, // 0 Buy 1 Sell
          "bidType": bidType === "market" ? 0 : 1,
          "expiredAt": expire,
          "fullRequired": fieldValue.fullRequired,
          "lots": [{
            "price": fieldValue["priceForInstrument"],
            "amount": fieldValue["amountOfInstrument"],
          }]
        }
        console.log("BODY", body)
        await fetch(
          kseRESTApi + "/api/Trading/CreateBid",
          {
            "headers": { "content-type": "application/json", "Authorization": "Bearer " + token },
            "method": "POST",
            "body": JSON.stringify(body)
          }
        )
        .then(response => response.json())
        .then(function(res){
          console.log("RES", res)
          if(res.isSuccess === true){
            props.callSuccessToast("???????????? ??????????????")
            props.setShowOrderSell(false)
          }
          else{
            props.callErrorToast(res.errors[0])
          }
        })
      }else{swAllert("?????????????? ????????????????????!", "warning")}
    }else{swAllert("?????????????? ???????????????? ????????!", "warning")}
  }
  /***?????????????????? */
  return (
    <div style={modalStyle} className={classes.modal}>
      <table style={{backgroundColor:'#ff7043'}}>
        <tr>
          <td 
           width="99%" 
           style={{width:'100%', color:'white', fontFamily:'Roboto', fontSize:14, fontWeight:'bold', textAlign:'center'}}>
             ???????? ???????????? ???? ??????????????
            </td>
          <td onClick={()=> props.setShowOrderSell(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2 }}/></td>
        </tr>
      </table>
      <div>
        <table align="center" width="100%">
          <tr>
            <td width="15%">???????????????? ????????</td>
            <td width="35%">
              <Select
                name = {"tradingAccount"}
                placeholder = {"??????????????..."}
                value = {selectedOptions["tradingAccount"]}
                onChange = {handleSelectChange}
                options = {enumOptions["tradingAccount"]}
              />
            </td>
          </tr>
          <tr>
            <td width="15%">?????? ??????????????</td>
            <td width="35%" height="10%">
              <Select
                name = {"organizationId"}
                placeholder = {"??????????????..."}
                value = {selectedOptions["organizationId"]}
                onChange = {handleSelectChange}
                options = {enumOptions["organizationId"]}
                isDisabled={true}
              />
            </td>
          </tr>          
        </table>
        <table width="100%">
          <tr>
            <td>
              <Select
                name = {"financeInstrument"}
                placeholder = {"?????????? ????????????????????..."}
                value = {selectedOptions["financeInstrument"]}
                onChange = {handleSelectChange}
                options = {enumOptions["financeInstrument"]}
              />
            </td>
          </tr>
        </table>
        <table align="center" width="100%">
          <tr>
            <td align="center">
              <Button
                style={{
                  fontFamily: 'Roboto',
                  margin: 2,
                  height: 27,
                  fontSize: 10,
                  fontWeight:'bold',
                  textAlign:'center',
                  width: "40%",
                  color: bidType === "limited" ? "white" : "black",
                  borderColor: bidType === "limited" ? "black" : "#1a237e",
                  backgroundColor: "#2979ff"
                }}
                variant="outlined"                
                onClick = {() => setBidType("limited")}
              >
                ????????????????????????????
              </Button>  
              <Button
                style={{
                  fontFamily: 'Roboto',
                  margin: 2,
                  height: 27,
                  fontSize: 10,
                  fontWeight:'bold',
                  textAlign:'center',
                  width: "40%",
                  color: bidType === "market" ? "white" : "black",
                  borderColor: bidType === "market" ? "black" : "#1a237e",
                  backgroundColor: "#2979ff"
                }}
                variant="outlined"                   
                onClick = {() => setBidType("market")}                
                >
                  ????????????????
              </Button>                          
            </td>
          </tr>
        </table>
        {bidType === "limited" &&
          <div overflow="auto">
            <table align="center" width="100%">
              <tr>
                <td>???????? ???? ????????????????????</td>
                <td>
                  <TextareaAutosize
                    style={{width: 70}}
                    value = {fieldValue.priceForInstrument}
                    onChange = {handleIntChange}
                    name = "priceForInstrument"
                    InputProps={{inputComponent: IntegerFormat}}
                  />
                  <AddIcon fontSize="small" onClick={()=> add("priceForInstrument", "priceForInstrumentStep")}/>
                  <RemoveIcon fontSize="small" onClick={()=> reduce("priceForInstrument", "priceForInstrumentStep")}/>
                </td>
              </tr>              
            {/* ???????????????????? */}
              <tr>
                <td>??????-????</td>
                <td>
                  <TextareaAutosize
                    style={{width: 70}}
                    value={fieldValue.amountOfInstrument}
                    onChange={handleIntChange}
                    name="amountOfInstrument"
                    InputProps={{inputComponent: IntegerFormat}}
                  />
                  <AddIcon fontSize="small" onClick={()=> add("amountOfInstrument", "amountOfInstrumentStep")}/>
                  <RemoveIcon fontSize="small" onClick={()=> reduce("amountOfInstrument", "amountOfInstrumentStep")}/>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>?????? ????????: {fieldValue["priceForInstrumentStep"]}</td>
                <td>??????: {fieldValue["amountOfInstrumentStep"]}</td>
              </tr>
              {/* ???????? ?????????? */}
              <tr>
                <td>???????? ??????????</td>
                <td>
                  <Checkbox 
                    size="small" 
                    style={{color:"green"}}
                    name="fullRequired"
                    onChange={handleCheckboxChange}
                    checked={(fieldValue["fullRequired"] === false || fieldValue["fullRequired"] === null || fieldValue["fullRequired"] === undefined) ? false : true}
                  />
                </td>
              </tr>
            </table>
            {/* ?????????? ???????????? */}
            <table align="center" width="100%">
              <tr>
                <td>?????????? ????????????</td>
                <td style={{fontSize: "10px"}}> 
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                  <DateTimePicker
                    value={fieldValue.expiredAt}
                    name="expiredAt"
                    onChange={(newValue) => handleDateTimeChange(newValue, "expiredAt")}
                    renderInput={(params) => <TextField size="small" variant="outlined" {...params} />}
                  />
                </LocalizationProvider>
                </td>
              </tr>
            </table>            
          </div>
        }
        {bidType === "market" &&
          <div overflow="auto">
            <table align="center" width="100%">
              <tr>
                <td>???????? ???? ????????????????????: ????????????????</td>
              </tr>
              <tr>
                <td>??????????:</td>
              </tr>
              <tr>
                <td>????????:</td>
              </tr>
            </table>
            <table align="center" width="60%">
              <tr>
                <td className="dragble-div-body-td-text-style">??????????????</td>
                <td className="dragble-div-body-td-text-style">??????????????</td>
                <td className="dragble-div-body-td-text-style">??????????????????</td>
              </tr>
            </table>
          </div>
        }        
        <table width="100%" style={{margin: 5}}>
          <tr align="center">
            <td>
              <Button
                variant="contained"                      
                onClick = {()=> sendOrder()}
                style={{
                  margin: 3,
                  height: 27,
                  fontSize: 10,
                  color: "white",
                  backgroundColor: "green",
                  border:'solid 1px #1b5e20',
                  fontFamily: 'Roboto'
                }}
                >??????????????????
              </Button>
              <Button
                  variant="contained"                         
                  onClick = {()=> props.setShowOrderSell(false)}
                  style={{
                    margin: 3,
                    height: 27,
                    fontSize: 10,
                    color: "white",
                    backgroundColor: "#dd2c00",
                    border:'solid 1px #bf360c',
                    fontFamily: 'Roboto'
                  }}
                >????????????
              </Button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  )
}