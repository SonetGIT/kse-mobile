import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from 'react-select'; // https://react-select.com/home
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Tab from '@mui/material/Tab';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import ruLocale from 'date-fns/locale/ru';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import Checkbox from '@material-ui/core/Checkbox';
// Icons
import AddIcon from '@mui/icons-material/AddCircleOutline';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Grid from '@material-ui/core/Grid';
import 'react-toastify/dist/ReactToastify.css';
// CUSTOM COMPONENTS
// Library
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import '../styles/generalStyles.css';

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
  const bottom = 85;
  const left = 82;
  return {
    bottom: `${bottom}%`,
    left: `${left}%`,
    transform: `translate(-${bottom}%, -${left}%)`,
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
            name: props.name,
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
  name: PropTypes.string.isRequired,
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

//Home(props) - получаем переменные от родителя App.js 
export default (props) => {
  const classes = useStyles()
  const [token] = useState(props.token)
  const [kseRESTApi] = useState(props.kseRESTApi) //Local KFB main REST
  const [userProfile, setUserProfile] = useState(props.userProfile)
  const [updateState, setUpdateState] = useState(false)
  const [enumData, setEnumData] = useState({})
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [modalStyle] = useState(getModalStyle)
  const [bidType, setBidType] = useState("limited")
  const [fieldValue, setFieldValue] = useState({subject: "", body: ""})
  const [selectedRecipient, setSelectedRecipient] = useState(null)
   
  useEffect(async()=>{
    console.log("ORDER BUY PROPS", props)
    let enumDataToCollect = [
      {enumName: "recipients", enumDef: "5b78d9dd-821d-4c6a-a00a-3af85224fbc4"},
    ]
    let enums = await props.getEnumDataByList(enumDataToCollect)
    console.log("BUY ENUMS", enums)
    setEnumData(enums)
    let eOpts = await props.createEnumOptions(enums)
    setEnumOptions(eOpts)    
  },[])
  function swAllert(text, icon){
    return(
      swal({
        text: text,
        icon: icon,
        buttons: {ok: "Ок"},
      })
    )
  }
  function handleTextChange(event){
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  // SELECT
  function handleSelectChange(option){
    setSelectedOptions({...selectedOptions, [option.name]: option})
    setSelectedRecipient(option.value)
    console.log("OPT", option, fieldValue)
  }
  //ОТПРАВИТЬ СООБЩЕНИЕ
  async function sendMessage(){
    let body = {
      subject: fieldValue["subject"],
      body: fieldValue["body"],
      recipients: [selectedRecipient]
    }
    console.log("MBODY", body)
    await fetch(
      kseRESTApi + "/api/Messages/Create",
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + token },
        "method": "POST",
        "body": JSON.stringify(body)
      }
    )
    .then(response => response.json())
    .then(async function(res){
       console.log("RESP", res)
      if(res.isSuccess === true){
        props.callSuccessToast("Сообщение отправлено!")
        props.closeSendMessageForm()
        props.showOutMessagesForm()
      }
      else{
        props.callErrorToast(res.errors[0])
      }
    })
  }
  
  /*ОТРИСОВКА************************************************************************************************/
  return (
    <div style={modalStyle} className={classes.modal}>
      <table style={{backgroundColor:'#ff7043'}}>
        <tr>      
          <td
            width="99%" 
            style={{width:'100%', color:'white', fontFamily:'Roboto', fontSize:16, fontWeight:'bold', textAlign:'center'}}>
              Новости
            </td>
          <td onClick={()=> props.setShowSendMessage(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2 }}/></td>
        </tr>
      </table>
      <table align='center' style={{color:'#ff7043', height:50, padding:10, fontSize:13}}>
       <a href="https://www.kse.kg/ru/RussianNewsBlog/"></a>
      </table>     
    </div>    
  )
}