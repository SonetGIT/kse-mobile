import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Input from '@mui/material/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import logo from '../pages/logo.png';

//#FFFFFF - white //#FFFAFA - snow //#e0e0e0 - Gray88 //#616161 - Granite Gray
const useStyles = makeStyles((theme) => ({
  p:{ 
    margin:10, 
    fontFamily:'Roboto', 
    color:'#1565c0',
    fontWeight:'bold',
    textAlign:'center',
    fontSize:18
  },
  textField:{
    marginBottom:20,
    width:260,     
    border:'solid 1px #fafafa',
    background:'#FFFAFA',
    borderRadius:'10px'
  },
  formControl:{    
    width:260,
    border:'solid 1px #fafafa',
    borderRadius:10
  },
  btn:{
    color:'#FFFAFA',
    border:'solid 1px #FF6800',
    backgroundColor:'#ff7043',   
    marginTop:45,
    marginBottom:20,
    fontFamily:'Roboto',
    fontSize:15,    
    width:260,
    height:37
  }
}));

export default function Authentication(props) {  
  const cls = useStyles();
  const [kseRESTApi] = useState(props.kseRESTApi) //KFB main REST
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(false);

  useEffect(()=>{
    let token = localStorage.getItem('token')    
      setShowLogin(true)
  },[])
 
  /*ФУНКЦИИ*************************************************************************************************************************************/
  function handleLoginChange(event){
    // console.log("LOGIN", event.target.value)
    setUsername(event.target.value)
    setError(false)
  }
  function handlePasswordChange(event){
    // console.log("PASS", event.target.value)
    setPassword(event.target.value)
    setError(false)
  }
  function handleClickShowPassword(){
    // console.log("SH PASS", !showPassword)
    setShowPassword(!showPassword)
  }
  function handleRememberMeChange(event){
    // console.log("RM ME", event.target.checked)
    setRememberMe(event.target.checked)
  }
  async function LoginButtonClick() {
    let body = JSON.stringify({
          "userName": username,
          "password": password
        })
    await fetch(kseRESTApi + "/api/users/Login",
      {
        "headers": { "content-type": "application/json" },
        "method": "POST",
        "body": body
      }
    )
    .then(response => response.json())
    .then(async function(res){
        // console.log("RES", res)
        // console.log("AUTH TOKEN", res.token)
        if(res.isAuthSuccessful === true){
          // props.setToken(res.token)
          await fetchUserProfile(res.token)
          setUsername("")
          setPassword("")
          if(rememberMe === true){
            localStorage.setItem("token", res.token)
          }
        }
        else{
          setError(true)
        }
      }
    )
    .catch(function(er){
      console.log("ERR", er)
    })
  }
  async function fetchUserProfile(token) {
    console.log("LOAD PROFILE")
    await fetch(
      kseRESTApi + "/api/users/GetUserInfo",
      {
        "headers": {"Authorization": "Bearer " + token},
        "method": "GET"
      }
    )
    .then(response => response.json())
    .then(async function(res){
        console.log("PROFILE", res)
        await props.authenticate(res, token)
      }
    )
  }
  function onKeyPressLogin(event){
    let code = event.charCode
    if(code === 13){
      // console.log("CODE", code)
      handleLoginChange(event)
      LoginButtonClick()
    }
  }
  function onKeyPressPassword(event){
    let code = event.charCode
    if(code === 13){
      // console.log("CODE", code)
      handlePasswordChange(event)
      LoginButtonClick()
    }
  }
/*ОТРИСОВКА*************************************************************************************************************************************************/
  return (
    showLogin === true &&
    <React.Fragment>
      <CssBaseline />
      <Container style={{paddingTop:150}}>
        {/* <Card> */}
          <div align='center'><img src={logo} alt='Logo' /></div>        
          <Typography variant='h5' style={{fontFamily: 'Roboto', color:'#ff7043', textAlign:'center', textShadow:'1px 1px #dd2c00'}}>
            Кыргызская Фондовая Биржа
          </Typography>
          <form
            noValidate
            autoComplete='off'
            align='center'
          > 
            {error === true && <p style={{color: 'red'}}>Не верное имя пользователя или пароль!</p>}
            {/*Имя пользователя*/}
            <div style={{paddingTop:'25px'}}>
              <TextField 
                id="username"
                label="Логин"               
                autoComplete={true}
                variant="standard"
                error={error}
                size='small'
                name='username'                
                autoFocus={true}                
                value={username}
                onChange={handleLoginChange}
                onKeyPress={onKeyPressLogin}
                className={cls.textField}
              />
            </div>
            {/* Пароль */}
            <div align='center'>
              <FormControl
                size='small'              
                variant="standard"
                // className={cls.formControl}
              >
                <InputLabel htmlFor="password"> Пароль </InputLabel>
                <TextField
                  id='password'
                  label="Пароль"
                  variant="standard"
                  error={error}
                  size='small'
                  name='password'
                  autoFocus={true}
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  onChange={handlePasswordChange}
                  onKeyPress={onKeyPressPassword}
                  className={cls.textField}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        edg='end'
                        labelPlacement='start'
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }                
                />              
              </FormControl>
            </div>
          </form>
          {/*Checkbox + lableName */}
          <div align='center' style={{color:'#1565c0', marginTop:'10px'}}>             
            <FormControl component='fieldset'>
              <FormGroup aria-label='position' row>
                <FormControlLabel          
                  value='end'
                  control={
                    <Checkbox 
                      size='small' 
                      style={{color:'#1565c0'}} 
                      onChange={handleRememberMeChange}
                      checked={rememberMe}
                    />
                  }
                  label={<Typography style={{fontFamily:'Garamond', fontSize:18}}>Запомнить меня?</Typography>} 
                  labelPlacement='end'
                />
              </FormGroup>
            </FormControl>
          </div>
          <div align='center'>
            <Button
              name='Login'
              variant='contained' 
              onClick={()=> LoginButtonClick()}
              className={cls.btn}             
            >
              <b>Войти</b>
            </Button>
          </div>
          {/* </Card> */}
      </Container>
    </React.Fragment>
  )
}