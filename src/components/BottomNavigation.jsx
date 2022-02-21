import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import {GiNewspaper} from 'react-icons/gi';
import {RiMessage2Fill} from 'react-icons/ri';
import { IoArrowRedoCircleOutline } from 'react-icons/io5';
import {RiHome8Fill} from 'react-icons/ri';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {IoIosMail} from 'react-icons/io';
import {IoIosMailUnread} from 'react-icons/io';
import {MdOutgoingMail} from 'react-icons/md';
import {MdContactSupport} from 'react-icons/md';
import { shouldForwardProp } from '@mui/styled-engine';
import SendMessage from './SendMessage.jsx';
import IncomingsMessages from './IncomingsMessages.jsx';
import OutgoingMessages from './OutgoingMessages.jsx';
import ContactSupport from './ContactSupport.jsx';
import News from './News.jsx';

const messageExamples = [];

function refreshMessages() {
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

  return Array.from(new Array(50)).map(
    () => messageExamples[getRandomInt(messageExamples.length)],
  );
}

export default function FixedBottomNavigation(props) {
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token] = useState(props.token)
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const [messages, setMessages] = React.useState(() => refreshMessages());
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const [showSendMessage, setShowSendMessage] = useState(false)
  const [showOutMessages, setShowOutMessages] = useState(false)
  const [showIncomMessages, setShowIncomMessages] = useState(false) 
  const [showContactSupp, setShowContactSupp] = useState(false)
  const [unreadCount, setUnreadCount] = useState(null)
  const [showNews, setShowNews] = useState(null)

  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
    setMessages(refreshMessages());
    fetchUnreadCount()
  }, [value, setMessages]); 

  async function getUnreadCount(){
    let data = await fetch(kseRESTApi + "/api/Messages/UnreadCount", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      return res
    })
    .catch(function (error) {
      console.log("Collecting doc error: ", error)
      return {}
    })
    return data
  }
  async function fetchUnreadCount(){ 
    let unreadMess = await getUnreadCount()
    console.log("BADG", unreadMess)
    if(unreadMess.data > 0){
      setUnreadCount(unreadMess.data)
    }
  }
  //ОТКРЫТЬ КОНТЕКСТНОЕ МЕНЮ
  async function handleOpenMenu(event){
    setAnchorEl(event.currentTarget)
    // console.log("DBL BID", event.currentTarget)
  }
  //ЗАКРЫТЬ КОНТЕКСТНОЕ МЕНЮ
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const closeSendMessageForm = () => {
    setShowSendMessage(null)
  } 
  //Вызов формы НАПИСАТЬ
  function showSendMessageForm(){
    handleCloseMenu()
    setShowSendMessage(!showSendMessage)
  }
  //ОТКРЫТЬ СПИСОК ВХОДЯЩИХ СООБЩЕНИЙ
  function showIncomMessagesForm(){
    handleCloseMenu()
    setShowIncomMessages(!showIncomMessages)
  }  
  //ОТКРЫТЬ СПИСОК ОТПРАВЛЕННЫХ СООБЩЕНИЙ
  function showOutMessagesForm(){
    handleCloseMenu()
    setShowOutMessages(!showOutMessages)
  }
  function showContactSuppForm()
  {
      handleCloseMenu()
      setShowContactSupp(!showContactSupp)
  }
  function showNewsForm(){
    setShowNews(!showNews)
  }
  //ОТРИСОВКА
  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper 
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} 
        elevation={3}        
        >        
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {setValue(newValue);}}
          style={{backgroundColor:'#ffd6c9', height:50, fontSize:8, borderTopLeftRadius:5, borderTopRightRadius:5}}          
        >
         <BottomNavigationAction 
            label='Главное'
            style={{color:'#dd2c00', fontFamily:'Roboto'}} 
            icon={
              <RiHome8Fill 
                size={14} 
                style={{color:'#dd2c00'}}
              />
            }
          />
          <BottomNavigationAction 
            label='Сообщения'
            style={{color:'#dd2c00', fontFamily:'Roboto'}}
            onClick={handleOpenMenu}            
            icon={
              <IoIosMail
                id='menuNav' 
                size={15} 
                style={{color:'#dd2c00'}}
                onClick={handleOpenMenu}
              />
            }
          />
          <BottomNavigationAction 
            label='Новости'
            style={{color:'#dd2c00', fontFamily:'Roboto'}} 
            onClick={() => showNewsForm()}           
            icon={
              <GiNewspaper 
                size={14} 
                style={{color:'#dd2c00'}}
                onClick={()=>showNewsForm()}
              />              
            }            
          />
          <BottomNavigationAction
            label='Контакты'
            style={{color:'#dd2c00', fontFamily:'Roboto'}}
            onClick={()=> showContactSuppForm()}
            icon={
              <MdContactSupport
                sixe={15}
                style={{color:'#dd2c00'}}
                onClick={()=> showContactSuppForm()}
              />
            }
          />
          <BottomNavigationAction 
            label='Выйти'
            style={{color:'#dd2c00', fontFamily:'Roboto'}} 
            onClick={() => props.exitSystemClick()}
            icon={
              <IoArrowRedoCircleOutline 
                size={15} 
                style={{color:'#dd2c00'}}
                onClick={() => props.exitSystemClick()}
              />
            }
          />
          <Menu
            id="menu-bids"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': "menuNav",
            }}
          >
          <MenuItem 
            onClick ={()=> showSendMessageForm()}
            style={{fontSize:12, fontFamily:'Roboto'}}>
            <RiMessage2Fill 
              size='15'
              style={{color:'#dd2c00', marginRight:4}}
              onClick ={()=> showSendMessageForm()}
            />
            Написать
          </MenuItem>         
          <MenuItem 
            onClick ={()=> showIncomMessagesForm()} 
            style={{fontSize:12, fontFamily:'Roboto'}}>            
            <IoIosMailUnread
              size='15'
              style={{color:'#dd2c00', marginRight:4}}
              onClick ={()=> showIncomMessagesForm()}
            />
              Входящие
            {unreadCount !== null &&
              <div 
                style={{
                  background:'#98FB98',
                  borderRadius:8,
                  width:15,
                  height:16,
                  margin:4,
                  fontFamily:'Roboto',
                  fontSize:11,
                  textAlign:'center',
                  color:'#dd2c00',
                  fontWeight:'bold'
                }}>                
                  {unreadCount}
              </div>
            }
          </MenuItem>          
          <MenuItem 
            onClick ={()=> showOutMessagesForm()}
            style={{fontSize:12, fontFamily:'Roboto'}}>
            <MdOutgoingMail 
              size='15'
              style={{color:'#dd2c00', marginRight:4}}
              onClick ={()=> showOutMessagesForm()}
            />
            Отправленные
          </MenuItem>
        </Menu>
        {showSendMessage === true &&
          <SendMessage
            //VARS
            kseRESTApi={props.kseRESTApi}
            token={props.token}
            userProfile={props.userProfile}
            //FUNCTIONS
            setShowSendMessage={setShowSendMessage}
            getEnumDataByList={props.getEnumDataByList}
            createEnumOptions={props.createEnumOptions}
            callSuccessToast={props.callSuccessToast}
            callErrorToast={props.callErrorToast}
            closeSendMessageForm={closeSendMessageForm}
            showOutMessagesForm={showOutMessagesForm}                     
          />}
        {showIncomMessages === true &&
          <IncomingsMessages
            // VARS
            kseRESTApi={props.kseRESTApi}
            token={props.token}
            userProfile={props.userProfile}
            // FUNCTIONS
            setShowIncomMessages={setShowIncomMessages}
            getEnumDataByList={props.getEnumDataByList}
            createEnumOptions={props.createEnumOptions}
            callSuccessToast={props.callSuccessToast}
            callErrorToast={props.callErrorToast}
          />
        }
        {showOutMessages === true &&
          <OutgoingMessages
            // VARS
            kseRESTApi={props.kseRESTApi}
            token={props.token}
            userProfile={props.userProfile}
            // FUNCTIONS
            setShowOutMessages={setShowOutMessages}
            getEnumDataByList={props.getEnumDataByList}
            createEnumOptions={props.createEnumOptions}
            callSuccessToast={props.callSuccessToast}
            callErrorToast={props.callErrorToast}
          />
        }
        {showContactSupp === true &&
          <ContactSupport
            kseRESTApi={props.kseRESTApi}
            token={props.token}
            userProfile={props.userProfile}
            setShowContactSupp={setShowContactSupp}
          />
        }
        {showNews === true &&
          <News
            setShowNews={setShowNews}
          />        
        }
        </BottomNavigation>
      </Paper>
    </Box>
  );
}