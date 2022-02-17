import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { IoIosCloseCircleOutline } from 'react-icons/io';

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

//Home(props) - получаем переменные от родителя App.js 
export default (props) => {
  const classes = useStyles()  
  const [modalStyle] = useState(getModalStyle)
     
  useEffect(async()=>{
    console.log("Contact PROPS", props)       
  },[])
  
  /*ОТРИСОВКА************************************************************************************************/
  return (
    <div style={modalStyle} className={classes.modal}>
      <table style={{backgroundColor:'#ff7043'}}>
        <tr>      
          <td
            width="99%" 
            style={{width:'100%', color:'white', fontFamily:'Roboto', fontSize:16, fontWeight:'bold', textAlign:'center'}}>
              Контакты
            </td>
          <td onClick={()=> props.setShowContactSupp(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2 }}/></td>
        </tr>
      </table>
      <table align='center' style={{color:'#ff7043', height:50, padding:10, fontSize:13}}>
        <tr>Адрес: г. Бишкек, ул. Московская, 172</tr>
        <tr>Почтовый адрес: 720010 Кыргызская Республика</tr>
        <tr>Телефон: +996 312 31-14-84</tr>
        <tr>Факс: +996 312 31-14-83</tr>
        <tr>E-mail: office@kse.kg</tr>
      </table>     
    </div>    
  )
}