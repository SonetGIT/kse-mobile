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
import {GoBriefcase} from 'react-icons/go';
import { Grid } from '@material-ui/core';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Snackbar from '@material-ui/core/Snackbar';
import { IoMdArrowDropright} from 'react-icons/io';
import { IoMdArrowDropleft } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import 'react-toastify/dist/ReactToastify.css';
// CUSTOM COMPONENTS
// Library
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import '../styles/generalStyles.css';
var moment = require('moment');
var generator = require('generate-password');

//Стили заголовка
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: '100%',
    borderRadius: "7px",
    border: '1px solid #d7ccc8',
    boxShadow: theme.shadows[1],
    padding: 3,
    fontFamily:'Roboto',
    fontSize:12,
    background:'#f5f5f5'
  },  
  td:{    
    borderBottom:'solid 1px #ffd6c9',
    borderRight:'solid 1px #ffd6c9',
    fontFamily:'Roboto',
    fontWeight:'bold',
    fontSize:12,
    color:'#424242',
    paddingLeft:8,
    paddingRight:8,
    height:40
    // backgroundColor:'#ffd6c9'
  },
  td1:{    
    borderBottom:'solid 1px #ffd6c9',
    fontFamily:'Roboto',
    fontSize:11,
    color:'#757575',
    paddingLeft:5,
    width:'100%'  
  }
}));
function getModalStyle() {
  const bottom = 73;
  const left = 73;
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
  const cls = useStyles()
  const [token] = useState(props.token)
  const [kseRESTApi] = useState(props.kseRESTApi) //Local KFB main REST
  const [userProfile, setUserProfile] = useState(props.userProfile)
  const [updateState, setUpdateState] = useState(false)
  const [enumData, setEnumData] = useState({})
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [modalStyle] = useState(getModalStyle)
  const [bidType, setBidType] = useState("limited")
  const [currIndex, setCurrIndex] = useState(0)
  const [docList, setDocList] = useState(null)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [clickedMessagesType, setClickedMessagesType] = useState("inbox") 
  const [selectedMessages, setSelectedMessages] = useState({}) 
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [taskType, setTaskType] = useState("malilsMainForm")

  useEffect(async()=>{
     let docL = await getIncomingsMessages()
     setDocList(docL)
    console.log("ORDER BUY PROPS", props)
    let enumDataToCollect = [
      {enumName: 'organizationId', enumDef:'5b78d9dd-821d-4c6a-a00a-3af85224fbc4'},
      {enumName: 'financeInstrument', enumDef: '3e819d7e-25d0-4a04-a3ff-092fd348a375'},
    ]
    let enums = await props.getEnumDataByList(enumDataToCollect)
    setEnumData(enums)
    let eOpts = await props.createEnumOptions(enums)
    setEnumOptions(eOpts)    
    console.log("Enums", enums) 
    console.log('DOCLOM', docL)
  },[])
  
  function handleCloseSnackBar(){
    setShowSnackBar(false)
  }
  
  async function getIncomingsMessages(){
    let docList = await fetch(kseRESTApi + "/api/Messages/Incomings", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      return res.data
    })
    .catch(function (error) {
      console.log("Collecting docList getIncomingsMessages error: ", error)
      return []
    })
    return docList
  }
  
  //ОБЩЕЕ КОЛИЧЕСТВО ИНСТРУМЕНТОВ  
  function LeftClick(currIndex){
    if(currIndex > 0){
      var prevPage = currIndex - 1
      setCurrIndex(prevPage)
    }
    else{
      setSnackBarMessage("Вы на первой записи!")
      setShowSnackBar(true)
    }
  }
  function RightClick(currIndex){
    if(currIndex === docList.length - 1){
      console.log("NO DATA", currIndex > docList.length-1)
      setSnackBarMessage("Больше нет записей!")
      setShowSnackBar(true)
    } 
    else{
      setCurrIndex(currIndex + 1)
    }    
  }
  /***ОТРИСОВКА */
  return (
    <div style={modalStyle} className={cls.modal}>
      {docList !== null && Object.keys(enumData).length > 0 &&
        <Grid>
          <table style={{backgroundColor:'#ff7043'}}>
            <tr>      
              <td
                width="99%" 
                style={{width:'100%', color:'white', fontFamily:'Roboto', fontSize:14, fontWeight:'bold', textAlign:'center'}}>
                  Входящие сообщения
                </td>
              <td onClick={()=> props.setShowIncomMessages(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2 }}/></td>
            </tr>
          </table>
          {docList.length !== 0 &&
            <table style={{color:'#f5f5f5', fontFamily:'Roboto', borderCollapse:'collapse'}}>
              <tr>
                <td className={cls.td}> Дата </td>
                <td className={cls.td1}>{moment(docList[currIndex].createdAt).format("YYYY-MM-DD hh:mm:ss")}</td>
              </tr>
              <tr>
                <td className={cls.td}> Заголовок </td>
                <td className={cls.td1}>{docList[currIndex].subject}</td>
              </tr>
              <tr>
                <td className={cls.td}> Содержание </td>
                <td className={cls.td1}>{docList[currIndex].body}</td>
              </tr>
            </table>
          }
          <Grid 
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          >
            <IconButton style={{padding:1, fontSize:19}} onClick={()=>LeftClick(currIndex)}>
              <IoMdArrowDropleft/>
            </IconButton>
              <tr style={{fontSize:10, clolor:'#757575', maxWidth:50, textAlign:'center'}}>{currIndex +1} / {docList.length} </tr>
            <IconButton style={{padding:1, fontSize:19}} onClick={()=>RightClick(currIndex)}>
              <IoMdArrowDropright/>
            </IconButton>
          </Grid>        
        </Grid>
      }
      <Snackbar
        style={{textAlign:'center', color:'red'}}
        open={showSnackBar}
        onClose={()=> handleCloseSnackBar()}
        autoHideDuration={1200}
        message={snackBarMessage}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
          }}
        >
      </Snackbar>
    </div>
  )
}