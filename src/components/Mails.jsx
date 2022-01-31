import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
// Form components
import { fade, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";

import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
// Icons
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import DraftsIcon from '@material-ui/icons/Drafts';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { IoMdClose } from 'react-icons/io';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import {RiMessage2Fill} from 'react-icons/ri';
import {IoIosMailUnread} from 'react-icons/io';
import {MdOutgoingMail} from 'react-icons/md';
import {MdDelete} from 'react-icons/md';

//Style
import "../styles/generalStyles.css"

// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import Tooltip from '@material-ui/core/Tooltip';
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'react-draggable';
// var fetch = require('node-fetch');
var generator = require('generate-password');
var moment = require('moment');

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
        });
      }}
      decimalSeparator={"."}
      thousandSeparator={" "}
      isNumericString
    />
  );
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
  onChange: PropTypes.func.isRequired,
}
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 350,
    height: 200,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  importFile: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  // modal: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  resizeForm: {
    position: 'absolute',
    height: "70%",
    width: "70%",
    resize: "both",
    overflow: "auto",
    minWidth: "150px",
    minHeight: "150px",
    background: "white"
  },
  modal: {
    position: 'absolute',
    width: '90%',
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
    backgroundColor:'#ffd6c9'
  },
  td1:{    
    borderBottom:'solid 1px #ffd6c9',
    fontFamily:'Roboto',
    fontSize:11,
    color:'#757575',
    paddingLeft:5,
    width:'100%'  
  }
}))
function getModalStyle() {
  const bottom = 200;
  const left = 5;
  return {
    bottom: `${bottom}%`,
    left: `${left}%`,
    transform: `translate(-${bottom}%, -${left}%)`,
  };
}
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}
export default (props) => {
  // This.state
  const classes = useStyles()
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token] = useState(props.token)
  const [userProfile] = useState(props.userProfile)
  const [enumData, setEnumData] = useState({})
  const [fieldValue, setFieldValue] = useState({subject: "", body: ""})
  const [searchFieldValue, setSearchFieldValue] = useState("")
  const [taskType, setTaskType] = useState("malilsMainForm")
  const [modalStyle] = useState(getModalStyle)
  
  const [updateState, setUpdateState] = useState(false)
  const [docList, setDocList] = useState(null)
  const [filteredDocList, setFilteredDocList] = useState(null)
  const [initialDocList, setInitialDocList] = useState(null)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState(false)
  const [clickedMessagesType, setClickedMessagesType] = useState("inbox")
  
  const [checked, setChecked] = useState([])
  const [recipients, setRecipients] = useState([])
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const leftChecked = intersection(checked, recipients)
  const rightChecked = intersection(checked, selectedRecipients)

  const [allMessagesSelected, setAllMessagesSelected] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState({})
  const [selectedMessage, setSelectedMessage] = useState(null)
  
  // Set data from props to state of component
  useEffect(async ()=>{
    console.log("MAILS PROPS", props.userTask)
    let enumDataToCollect = [
      {enumName: "recipients", enumDef: "5b78d9dd-821d-4c6a-a00a-3af85224fbc4"},
    ]
    let enums = await props.getEnumDataByList(enumDataToCollect)
    setEnumData(enums)
    console.log("MAIL ENUMS", enums)
    let newRecipients = []
    for(let d=0; d<enums["recipients"].length; d++){
      newRecipients.push(enums["recipients"][d].id)
    }
    setRecipients(newRecipients)
    let incomings = await props.fetchDocList("/api/Messages/Incomings")
    setFilteredDocList(incomings)
    setInitialDocList(incomings)
    fetchBySize(0, 9, incomings)
    console.log("MAILS DOCL", incomings)
  },[])
  
  function handleTextChange(event){
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  // random UUID generator
  function getUUID(){
    return uuidv4()
  }
  // random numbers generator
  function keyGen(length){
    var password = generator.generate({
      length: length,
      numbers: true
    })
    return password
  }
  async function buttonClick(name, item){
    if(name === "send"){
      // TODO
    }
    else if (name === "back"){
      // TODO
    }
  }
  // Pagination functions
  function KeyboardArrowFirstClick(){
    if(page !== 1){
      setPage(1)
      fetchBySize(0, size-1, filteredDocList)
    }
    else{
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowLeftClick(page){
    if(page !== 1){
      var prevPage = page - 1
      setPage(prevPage)
      let fetchFrom = ((prevPage -1) * size) //10
      let fetchTo = (size * prevPage)-1
      fetchBySize(fetchFrom, fetchTo, filteredDocList)
    }
    else{
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowRightClick(page){
    if(docList.length < size-1){
      // console.log("NO DATA")
      setSnackBarMessage("Больше нет данных!")
      setShowSnackBar(true)
    } 
    else{
      setPage(page + 1)
      let fetchFrom = (size * page)
      let fetchTo = ((page + 1) * size)-1
      fetchBySize(fetchFrom, fetchTo, filteredDocList)
    }    
  }
  function handleChangeRowsPerPage(event){
    setSize(event.target.value)
    setPage(1)
    fetchBySize(0, event.target.value-1, filteredDocList)
  } 
  function GoToPage(){
    let fetchFrom = (page*size-1)-size
    let fetchTo = page*size-1
    fetchBySize(fetchFrom, fetchTo, filteredDocList)
  }
  function handlePageChange(event){
    setPage(event.target.value)
  }
  function getPageAmount(){
    let pagesFloat = (filteredDocList.length)/size
    let mathRoundOfPages = Math.round(pagesFloat)
    if(pagesFloat > mathRoundOfPages){
      return mathRoundOfPages + 1
    }
    else{
      return mathRoundOfPages
    }
  }
  function handleCloseSnackBar(){
    setShowSnackBar(false)
  }
  // get rows amount of filtered docs by size
  function fetchBySize(fetchFrom, fetchTo, Data){
    let newDocList = []
    for(let i=fetchFrom; i<=fetchTo; i++){
      if(Data[i] !== undefined){
        newDocList.push(Data[i])
      }
    }
    setDocList(newDocList)
    setUpdateState(getUUID())
  }
  // Convert date to approptiate format
  function beautifyDate(date){
    try{
      var newDate = new Date(date) // "2020-01-26"
      var dd = String(newDate.getDate()).padStart(2, '0')
      var mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = newDate.getFullYear()
      let beautyDate = ""
      if(parseInt(dd) < 10){
        let shortdd = dd.substring(1, 2)
        dd = shortdd + " "
      }
      else{beautyDate += dd}
      switch(mm){
        case "01" : {
          mm = "янв."
          break
        }
        case "02" : {
          mm = "февр."
          break
        }
        case "03" : {
          mm = "мар."
          break
        }
        case "04" : {
          mm = "апр."
          break
        }
        case "05" : {
          mm = "мая"
          break
        }
        case "06" : {
          mm = "июня"
          break
        }
        case "07" : {
          mm = "июля"
          break
        }
        case "08" : {
          mm = "авг."
          break
        }
        case "09" : {
          mm = "сент."
          break
        }
        case "10" : {
          mm = "окт."
          break
        }
        case "11" : {
          mm = "ноя."
          break
        }
        case "12" : {
          mm = "дек."
          break
        }
        default: {
          break
        }
      }
      beautyDate += " " + mm + " " + yyyy.toString().substring(2, 4) + "г."
      // console.log("beautyDate", beautyDate)
      return beautyDate
    }
    catch(er){
      return "NaN.NaN.NaN"
    }
  }
  // multiple selector functions
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked)
  }
  const handleAllRight = () => {
    setSelectedRecipients(selectedRecipients.concat(recipients));
    setRecipients([])
  }
  const handleCheckedRight = () => {
    setSelectedRecipients(selectedRecipients.concat(leftChecked));
    setRecipients(not(recipients, leftChecked));
    setChecked(not(checked, leftChecked));
  }
  const handleCheckedLeft = () => {
    setRecipients(recipients.concat(rightChecked));
    setSelectedRecipients(not(selectedRecipients, rightChecked));
    setChecked(not(checked, rightChecked));
  }
  const handleAllLeft = () => {
    setRecipients(recipients.concat(selectedRecipients));
    setSelectedRecipients([]);
  }
  const recipientsList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
              <ListItemText id={labelId} primary={getRecipentName(value)} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Paper>
  )
  function getRecipentName(id){
    for(let d=0; d<enumData["recipients"].length; d++){
      if(enumData["recipients"][d].id === id){
        return enumData["recipients"][d].label
      }
    }
  }
  const handleSelectAllMessagesChange = (event) => {
    setAllMessagesSelected(event.target.checked)
    for(let i=0; i<filteredDocList.length; i++){
      selectedMessages[filteredDocList[i].id] = event.target.checked
    }
    setSelectedMessages(selectedMessages)
  }
  const handleSelectMessage=(event)=>{
    console.log("Check MESS", event.target.id, "CH ", event.target.checked)
    setSelectedMessages({...selectedMessages, [event.target.id]: event.target.checked})
  }
  function handleSearchChange(event){
    setSearchFieldValue(event.target.value)
    console.log("FIELDVALUE", event.target.value)
  }
  function handleClickSearch(){
    console.log("SEARCH", searchFieldValue, clickedMessagesType, filteredDocList)
    if(searchFieldValue === ""){
      if(clickedMessagesType === "inbox"){
        handleInboxMessagesClick()
      }
      else if(clickedMessagesType === "sent"){
        handleSentMessagesClick()
      }
    }
    else{
      let newDocList = []
      if(clickedMessagesType === "inbox"){
        for(let i=0; i<initialDocList.recipient.length; i++){
          if(initialDocList.recipient[i].recipient_status === 1 || initialDocList.recipient[i].recipient_status === 2){
            try{
              let subject = initialDocList.recipient[i].subject.toLowerCase()
              let body = initialDocList.recipient[i].body.toLowerCase()
              let searchField = searchFieldValue.toLowerCase()
              if(subject.includes(searchField) || body.includes(searchField)){
                // console.log("FIND", initialDocList.recipient[i].subject, initialDocList.recipient[i].body)
                newDocList.push(initialDocList.recipient[i])
              }
            }
            catch(er){console.log(er)}
          }
        }
      }
      else if(clickedMessagesType === "sent"){
        for(let i=0; i<initialDocList.sender.length; i++){
          if(initialDocList.sender[i].sender_status === 3){
            try{
              let subject = initialDocList.sender[i].subject.toLowerCase()
              let body = initialDocList.sender[i].body.toLowerCase()
              let searchField = searchFieldValue.toLowerCase()
              if(subject.includes(searchField) || body.includes(searchField)){
                // console.log("FIND", initialDocList.sender[i].subject, initialDocList.sender[i].body)
                newDocList.push(initialDocList.sender[i])
              }
            }
            catch(er){console.log(er)}
          }
        }
      }      
      fetchBySize(0, 9, newDocList)
      setFilteredDocList(newDocList)
    }
    
  }
  async function handleInboxMessagesClick(){
    setClickedMessagesType("inbox")
    setAllMessagesSelected(false)
    setSelectedMessages({})
    let incomings = await props.fetchDocList("/api/Messages/Incomings")
    setFilteredDocList(incomings)
    setInitialDocList(incomings)
    fetchBySize(0, 9, incomings)
    console.log("INBOX", incomings)
  }
  async function handleSentMessagesClick(){
    setClickedMessagesType("sent")
    setAllMessagesSelected(false)
    setSelectedMessages({})
    let outgoings = await props.fetchDocList("/api/Messages/Outgoings")
    setFilteredDocList(outgoings)
    setInitialDocList(outgoings)
    fetchBySize(0, 9, outgoings)
    console.log("SENT", outgoings)
  }
  function getSenderName(sender){
    // console.log("enumData", enumData)
    for(let d=0; d<enumData["recipients"].length; d++){
      if(enumData["recipients"][d].id === sender){
        // console.log("SENDER", enumData["recipients"][d])
        return enumData["recipients"][d].label
      }
    }
  }
  function getBackround(status){
    if(status === 1){// message is unread
      return "#FFDCA5"
    }
    else{
      return "#F0F1F1"
    }
  }
  function getFontWeight(status){
    if(status === 1){
      return "bold"
    }
    else{
      return "nornal"
    }
  }
  function checkToShowDeleteButton(){
    let showButton = false
    if(Object.keys(selectedMessages).length > 0){
      for(let key in selectedMessages){
        if(selectedMessages[key] === true){
          showButton = true
          break
        }
      }
    }
    return showButton
  }
  function openMessage(message){
    setSelectedMessage(message)
    setTaskType("shomMessageForm")
  }
  // async function deleteMessages(){
  //   console.log("LISTS", selectedMessages, docList)
  //   if(clickedMessagesType === "inbox"){
  //     console.log("SEL", selectedMessages)
  //     let mailsToDelete = []
  //     for(let key in selectedMessages){
  //       mailsToDelete.push(key)
  //     }
  //     await fetch(
  //       kseRESTApi + "/api/Messages/Delete?direction=" + clickedMessagesType === "inbox" ? "i" : "o",
  //       {
  //         "headers": { "content-type": "application/json", "Authorization": "Bearer " + token },
  //         "method": "POST",
  //         "body": body
  //       }
  //     )
  //     .then(response => response.json())
  //     .then(function(res){
  //       console.log("UPDATE", res)
  //       if(res.isSuccess === true){
  //         props.callSuccessToast(successText)
  //       }
  //       else{
  //         props.callErrorToast(res.errors[0])
  //       }
  //     })
  //   }
  //   else if(clickedMessagesType === "sent"){
  //   }
  // }
  function getMenuItemStyle(name){
    return {
      // background: "#F0F1F1",
      color: "#dd2c00",
      fontWeight: "bold",
      fontFamily:'Roboto',
      fontSize:11,
      padding:2
    }
  }
  async function sendMessage(){
    let body = {
      subject: fieldValue["subject"],
      body: fieldValue["body"],
      recipients: selectedRecipients
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
      // console.log("RESP", res)
      if(res.isSuccess === true){
        props.callSuccessToast("Сообщение отправлено!")
        setTaskType("malilsMainForm")
      }
      else{
        props.callErrorToast(res.errors[0])
      }
    })
  }
  function backToMainForm(){
    setTaskType("malilsMainForm")
    setSelectedMessage(null)
  }
  if(updateState !== null){
    try{
      return(
        <Draggable handle="p">
          <div key={taskType} style={modalStyle} className={classes.modal}>          
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <div>
                  <p className="main-table-label-p-style">
                    <table style={{backgroundColor:'#ff7043'}}>
                      <tr>
                        <td 
                          width={"99%"}  
                          style={{width:'100%', color:'white', fontFamily:'Roboto', fontSize:16, fontWeight:'bold', textAlign:'center'}}>
                          Сообщения
                        </td>
                        <td>
                          <IoIosCloseCircleOutline 
                            size='20px' style={{color:'white', paddingTop:2}} 
                            onClick={()=> props.setShowMails(false)}/>
                        </td>
                      </tr>
                    </table>
                  </p>
                </div>
                {taskType === "malilsMainForm" &&
                  <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                    <Grid item xs={3}>
                        <Paper>
                          <MenuList>
                            <MenuItem onClick={() => setTaskType("writeMessage")} style={getMenuItemStyle("writeMessage")}>
                                <RiMessage2Fill size={17} style={getMenuItemStyle("writeMessage")}/>
                              <Typography variant="inherit">Написать</Typography>
                            </MenuItem>
                            <MenuItem onClick={()=> handleInboxMessagesClick()} style={getMenuItemStyle("inbox")}>
                                <IoIosMailUnread size={17} style={getMenuItemStyle("inbox")}/>
                              <Typography variant="inherit">Входящие</Typography>
                            </MenuItem>
                            <MenuItem onClick={()=> handleSentMessagesClick()} style={getMenuItemStyle("sent")}>
                                <MdOutgoingMail size={17} style={getMenuItemStyle("sent")}/>
                              <Typography variant="inherit">Отправленные</Typography>
                            </MenuItem>
                          </MenuList>
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item xs={12} align="left">
                          <Paper>
                          <Checkbox
                              style={{color: "green", size:8}}
                              onChange={handleSelectAllMessagesChange}
                              checked = {allMessagesSelected === true ? true : false}
                            />
                            {checkToShowDeleteButton() === true &&
                              <IconButton aria-label="delete" size="small">
                                {/* <MdDelete onClick={()=> deleteMessages()}/> */}
                              </IconButton>
                            }
                            {/* <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<CreateIcon />}
                              style={{margin: 5, color: "green", background: "white", fontSize: 14}}
                              onClick={() => setTaskType("writeMessage")}
                            >
                              Написать
                            </Button> */}
                            <TextField
                              size="small"
                              variant="outlined"
                              placeholder="Поиск в почте"
                              style={{width: "70%", paddingLeft: 50, margin: 3}}
                              onChange={handleSearchChange}
                              InputProps={{
                                endAdornment:
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={()=> handleClickSearch()}
                                      edge="end"
                                    >
                                      <SearchIcon size="small"/>
                                    </IconButton>
                                  </InputAdornment>,
                              }}
                            />
                          </Paper>
                        </Grid>
                        <Grid item xs={12} align="left">
                          <Paper style={{minHeight: "76px", paddingTop: docList === null ? "25px" : 0}}>
                            {docList !== null ?
                              <div>
                                <table
                                  className={classes.td}
                                  width="100%"
                                > 
                                  <thead>
                                    <tr >
                                      <td>                               
                                      </td>
                                      <td>
                                        Дата
                                      </td>
                                     {clickedMessagesType==="inbox" &&  
                                      <td>
                                        Отправитель
                                      </td>
                                      }
                                      <td>
                                        Заголовок
                                      </td>
                                      <td>
                                        Содержание
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody class="body-style">
                                    {Object.keys(docList).length !== 0 &&
                                      docList.map(dataItem => (
                                        <tr
                                          width="100%"
                                          key={keyGen(5)} 
                                          style={{
                                            "cursor": "pointer",
                                            "fontSize": 13,
                                            "height": 30,
                                            "background": clickedMessagesType === "inbox" ? getBackround(dataItem.recipient_status) : "#F0F1F1",
                                            "fontWeight": clickedMessagesType === "inbox" ? getFontWeight(dataItem.recipient_status) : "normal"
                                          }}
                                        >
                                          <td style={{"border-bottom": "1px solid grey"}}>
                                            <Checkbox
                                              style={{height: 15, color: "green", maxWidth: 25}}
                                              id={dataItem.id}
                                              onChange={handleSelectMessage}
                                              checked={selectedMessages[dataItem.id] === true ? true : false}
                                            />
                                          </td>
                                          <td 
                                            key = {keyGen(5)} 
                                            style = {{"border-bottom": "1px solid grey"}}
                                            align = "center"
                                            width = {150}
                                            onClick = {()=> openMessage(dataItem)}
                                          >
                                            {beautifyDate(dataItem.createdAt)}
                                          </td>
                                          {clickedMessagesType==="inbox" && 
                                            <td 
                                              key = {keyGen(5)} 
                                              style = {{"border-bottom": "1px solid grey"}} 
                                              width = {150}
                                              onClick = {()=> openMessage(dataItem)}
                                            >
                                              {getSenderName(dataItem.senderId)}
                                            </td>
                                          }
                                          <td 
                                            key = {keyGen(5)} 
                                            style = {{"border-bottom": "1px solid grey"}}
                                            onClick = {()=> openMessage(dataItem)}
                                          >
                                            {dataItem.subject}
                                            </td>
                                          <td 
                                            key = {keyGen(5)} 
                                            style = {{"border-bottom": "1px solid grey", "white-space": "wrap"}}
                                            onClick = {()=> openMessage(dataItem)}
                                          >
                                            {dataItem.body.substring(0, 50)}{dataItem.body.length > 50 ? "..." : ""}
                                          </td>
                                        </tr>
                                      )
                                    )}                    
                                  </tbody>
                                </table>
                              
                                <table size="small" style={{"border-collapse": "collapse", "white-space": "nowrap", fontSize: 13}}>
                                  <tfoot>
                                    <tr>
                                      <td style={{paddingLeft: "20px"}}>
                                        <div style={{minWidth: 80, color: "black"}}>Кол-во записей</div>
                                      </td>
                                      {/* <td>
                                        <FormControl 
                                          variant="outlined"
                                          style={{minWidth: 30}}
                                        >
                                          <MaterialSelect 
                                            onChange={handleChangeRowsPerPage}
                                            style={{height: 25, color: "black"}}
                                            value = {size}
                                            >
                                            <MenuItem value = {10}>10</MenuItem>
                                            <MenuItem value = {20}>20</MenuItem>
                                            <MenuItem value = {50}>50</MenuItem>
                                            <MenuItem value = {100}>100</MenuItem>
                                            <MenuItem value = {200}>200</MenuItem>
                                            <MenuItem value = {500}>500</MenuItem>
                                          </MaterialSelect>
                                        </FormControl>
                                      </td> */}
                                      <td>
                                        <Tooltip title="На первую страницу">
                                          <IconButton onClick={() => KeyboardArrowFirstClick()}>
                                            <FirstPageIcon style={{fontSize: "large", color: "black"}}/>
                                          </IconButton>
                                        </Tooltip>
                                      </td>
                                      <td>
                                        <Tooltip title="На предыдущюю страницу">
                                          <IconButton onClick={() => KeyboardArrowLeftClick(page)}>
                                            <ArrowBackIosIcon style={{fontSize: "medium", color: "black"}}/>
                                          </IconButton>
                                        </Tooltip>
                                      </td>
                                      <td style={{color: "black", fontSize: 16}}>
                                        <input style={{maxWidth: 25}} value={page} onChange={handlePageChange}></input>
                                      </td>
                                      <td style={{paddingLeft: "3px"}}>
                                        <Tooltip title="Перейти на указанную страницу">                              
                                            <Button
                                              onClick={()=> GoToPage()}
                                              variant="outlined"
                                              style={{
                                                height: 22,
                                                backgroundColor: "#D1D6D6",
                                                fontSize: 12
                                              }}
                                            >перейти
                                            </Button>
                                        </Tooltip>
                                      </td>
                                      <td>
                                        <Tooltip title="На следующюю страницу">
                                          <IconButton onClick={() => KeyboardArrowRightClick(page)}>
                                            <ArrowForwardIosIcon style={{fontSize: "medium", color: "black"}}/>
                                          </IconButton>
                                        </Tooltip>
                                      </td>
                                      <td style={{color: "black", fontSize: 13}}>Стр. {page} из {getPageAmount()}</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                              :
                              <Typography variant="inherit" noWrap>
                                В этой папке нет писем!
                              </Typography>
                            }
                          </Paper>
                        </Grid>
                        <Snackbar
                          open={showSnackBar}
                          onClose={()=> handleCloseSnackBar()}
                          autoHideDuration={1200}
                          message={snackBarMessage}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                }
                {taskType === "writeMessage" &&
                  <Paper>
                    <Grid container spacing={1} justify="center" alignItems="center" className={classes.root}>
                      <Grid item>{recipientsList(recipients)}</Grid>
                      <Grid item>
                        <Grid container direction="column">
                          <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllRight}
                            disabled={recipients.length === 0}
                            aria-label="move all selectedRecipients"
                          >
                            ≫
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected selectedRecipients"
                          >
                            &gt;
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected recipients"
                          >
                            &lt;
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllLeft}
                            disabled={selectedRecipients.length === 0}
                            aria-label="move all recipients"
                          >
                            ≪
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item>{recipientsList(selectedRecipients)}</Grid>
                      <Grid item xs={11}>
                        <Grid container direction="row">
                          <TextField
                              id="outlined-multiline-static"
                              label="Тема"
                              multiline
                              onBlur = {handleTextChange}
                              name = {"subject"}
                              defaultValue = {fieldValue["subject"]}
                              variant="outlined"
                              style={{width: "100%"}}
                            />
                          <TextField
                            id="outlined-multiline-static"
                            label="Текст уведомления"
                            multiline
                            rows={4}
                            onBlur = {handleTextChange}
                            name = {"body"}
                            defaultValue = {fieldValue["body"]}
                            variant="outlined"
                            style={{width: "100%"}}
                            />
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid container direction="row">             
                          <Button
                            key={keyGen(5)}
                            variant="outlined"
                            onClick = {() => sendMessage()}
                            style={{
                              margin: 3,
                              color: "white",
                              borderColor: "#161C87",
                              backgroundColor: "#287A2C",
                              height: 32,
                              fontSize: 12
                            }}
                            endIcon={<MdOutgoingMail/>}
                          >Отправить
                          </Button>
                          <Button
                            key={keyGen(5)}
                            variant="outlined"
                            // onClick = {() => sendMessage()}
                            style={{
                              margin: 3,
                              color: "white",
                              borderColor: "#161C87",
                              backgroundColor: "#ff1f1f",
                              height: 32,
                              fontSize: 12
                            }}
                          >Закрыть
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                }
                {taskType === "shomMessageForm" &&
                  <Paper>
                    <br/>
                    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                      <Grid item xs={10} align="center">
                          <Typography component="h1" variant="h6" color="inherit">{selectedMessage.subject}</Typography>
                      </Grid>
                      <Grid item xs={10} align="right">
                          <p style={{fontSize: 12}}>{"Время: "}{moment(selectedMessage.createdAt).format("YYYY-MM-DD hh:mm:ss")}</p>
                          {clickedMessagesType==="inbox" && <p style={{fontSize: 12}}>{"Отправитель: "}{getSenderName(selectedMessage.senderId)}</p>}
                      </Grid>
                      <Grid item xs={10} align="left">
                        <p>{selectedMessage.body}</p>
                      </Grid>
                      <br/>
                      <Grid item xs={10} align="center">
                        <Button
                          key={keyGen(5)}
                          variant="outlined"
                          onClick = {() => backToMainForm()}
                          style={{
                            margin: 3,
                            color: "white",
                            borderColor: "#161C87",
                            backgroundColor: "#ff1f1f",
                            height: 32,
                            fontSize: 12
                          }}
                        >Назад
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                }
              </Grid>
            </Grid>
          </div>
        </Draggable>
      )
    }
    catch(er){
      console.log("ERROR", er)
      return <LinearProgress/>
    }
  }
};
