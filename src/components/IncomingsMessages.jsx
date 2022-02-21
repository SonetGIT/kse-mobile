import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
// Icons
import { Grid } from '@material-ui/core';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Snackbar from '@material-ui/core/Snackbar';
import { IoMdArrowDropright} from 'react-icons/io';
import { IoMdArrowDropleft } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import {MdDeleteSweep} from 'react-icons/md';
import 'react-toastify/dist/ReactToastify.css';
// Library
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import '../styles/generalStyles.css';
var moment = require('moment');

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
    background:'#FFFAFA'
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
  const [activMessageKey, setActiveMessageKey] = useState(null)

  useEffect(async()=>{
    getIncomingsMessages()
  },[])
  async function getIncomingsMessages(){
    await fetch(kseRESTApi + "/api/Messages/Incomings", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){      
      let sortedDocList = res.data.sort(dynamicSort("createdAt", 1, "DateTime"))      
      setDocList(sortedDocList)
      setCurrIndex(0)
      setActiveMessageKey(getUUID())

      if(sortedDocList[0].read === false){
         getReadState(sortedDocList[0].id)
      }
      console.log("DOCLINCOM_MSGREAD", sortedDocList)
    })
    .catch(function (error) {
      console.log("Collecting docList getIncomingsMessages error: ", error)
      return []
    })
  }
  async function getReadState(id){
    await fetch(kseRESTApi + "/api/Messages/SetRead?incomingMessageId=" + id,
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      getIncomingsMessages()
      console.log("RES READSTATE", res)
    })
    .catch(function (error) {
      console.log("Collecting docList SetRead error: ", error)
      return []
    })
  }
  function getUUID(){
    return uuidv4()
  }
  function getEnumLabel(name, id){
    for(let d=0; d<enumData[name].length; d++){
      if(enumData[name][d].id === id){
        return enumData[name][d].label
      }
    }
  }
  function dynamicSort(property, sortOrder, type) {
    if(type === "DateTime" || type === "Bool"){
      sortOrder = sortOrder * -1
    }
    if(type === "DateTime"){
      return function(a, b){
        if(a[property] !== null && b[property] !== null){
          let dateA = new Date(a[property].substring(0, 19))
          let timeInSecA =  dateA.getTime()/1000
          // console.log("timeInSecA", timeInSecA)
          let dateB = new Date(b[property].substring(0, 19))
          let timeInSecB =  dateB.getTime()/1000
          // console.log("timeInSecB", timeInSecB)
          var result = (timeInSecA < timeInSecB) ? -1 : (timeInSecA > timeInSecB) ? 1 : 0
          return result * sortOrder
        }
        else{
          if(a[property] === null){
            return -1 * sortOrder
          }
          return 1 * sortOrder
        }
      }
    }
    else if(type === "Int" || type === "Text" || type === "Float" || type === "Bool"){
      return function(a, b){
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
        return result * sortOrder
      }
    }
    else if(type === "Enum"){
      return function(a, b){
        if(a[property] === null){
          return 1 * sortOrder
        }
        else{
          let labelA = getEnumLabel(property, a[property])
          // console.log("A", property, a[property], labelA)
          let labelB = getEnumLabel(property, b[property])
          // console.log("labelB", labelB, property, b)
          var result = (labelA < labelB) ? -1 : (labelA > labelB) ? 1 : 0
          return result * sortOrder
        }
        
      }
    }
  }    
  function handleCloseSnackBar(){
    setShowSnackBar(false)
  }
  //Удаление сообщение
  function deleteMessages(){
    swal({
      text: "Вы точно хотите удалить сообщение?",
      icon: "warning",
      buttons: {yes: "Да", cancel: "Отмена"}
    })
    .then(async(click) => {
      if(click === "yes"){
        await fetch(kseRESTApi + "/api/Messages/Delete?direction=i",
          {
            "headers": { "content-type": "application/json", "Authorization": "Bearer " + token},
            "method": "POST",
            "body": JSON.stringify([docList[currIndex].id])
          }
        )
        .then(response => response.json())
        .then(function(res){
            console.log("Delete IncomMessages", res)
            if(res.isSuccess === true){
              props.callSuccessToast("Сообщение удалено!")
              getIncomingsMessages()
            }
            else{
              props.callErrorToast(res.errors[0])
            }
          }
        )
      }
    })
  }  
  //ОБЩЕЕ КОЛИЧЕСТВО ИНСТРУМЕНТОВ  
  function LeftClick(currIndex){
    if(currIndex > 0){
      var prevPage = currIndex - 1
      setCurrIndex(prevPage)
      if(docList[currIndex - 1].read === false){
        getReadState(docList[currIndex - 1].id)
      }
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
      if(docList[currIndex + 1].read === false){
        getReadState(docList[currIndex + 1].id)
      }
    }    
  }
  /***ОТРИСОВКА */
  return (
    <div style={modalStyle} className={cls.modal}>
      {docList !== null && 
        <Grid>
          <table style={{backgroundColor:'#ff7043'}}>
            <tr>      
              <td
                width="99%" 
                style={{width:'100%', color:'white', font:'Roboto, bold', textAlign:'center'}}>
                  Входящие сообщения
              </td>
              <td onClick={()=> props.setShowIncomMessages(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2}}/></td>
            </tr>
          </table>
          {docList.length !== 0 && 
            <table style={{color:'#FFFAFA', fontFamily:'Roboto', borderCollapse:'collapse'}}>              
              <tr>
                <td className={cls.td}> Дата </td>
                <td style={{
                  borderBottom:'solid 1px #ffd6c9',
                  fontFamily:'Roboto',
                  fontSize:11,
                  color:'#757575',
                  paddingLeft:5,
                  width:'100%',
                  fontWeight: docList[currIndex].read === false ? 'bold' : 'normal',
                  textDecoration: docList[currIndex].read === false ? 'underline' : 'none',
                  textDecorationColor: docList[currIndex].read === false ? '#dd2c00' : '#FFFAFA'}} 
                >
                  {moment(docList[currIndex].createdAt).format("YYYY-MM-DD hh:mm:ss")}
                </td>
              </tr>
              <tr>
                <td className={cls.td}> Тема </td>
                <td style={{
                  borderBottom:'solid 1px #ffd6c9',
                  fontFamily:'Roboto',
                  fontSize:11,
                  color:'#757575',
                  paddingLeft:5,
                  width:'100%',
                  fontWeight: docList[currIndex].read === false ? 'bold' : 'normal',
                  textDecoration: docList[currIndex].read === false ? 'underline' : 'none',
                  textDecorationColor: docList[currIndex].read === false ? '#dd2c00' : '#FFFAFA'}} 
                >
                  {docList[currIndex].subject}
                </td>
              </tr>
              <tr>
                <td className={cls.td}> Содержание </td>
                <td style={{
                  borderBottom:'solid 1px #ffd6c9',
                  fontFamily:'Roboto',
                  fontSize:11,
                  color:'#757575',
                  paddingLeft:5,
                  width:'100%',
                  fontWeight: docList[currIndex].read === false ? 'bold' : 'normal',
                  textDecoration: docList[currIndex].read === false ? 'underline' : 'none',
                  textDecorationColor: docList[currIndex].read === false ? '#dd2c00' : '#FFFAFA'}}
                >
                  {docList[currIndex].body}
                </td>
              </tr>
            </table>
          }
          <Grid 
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          >
            <MdDeleteSweep 
              size='15'
              style={{color:'#dd2c00', marginRight:25}}
              onClick={()=> deleteMessages()}
            />
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