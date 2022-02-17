import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { IoIosCloseCircleOutline } from 'react-icons/io'; //icon

const useStyles = makeStyles((theme) => ({
  modal: {
    // width: '100%',
    height:'80vh',
    borderRadius: "7px",
    border: '1px solid #d7ccc8',
    padding: 3,
    fontFamily:'Roboto',
    fontSize:12,
    background:'#FFFAFA'
  }
}))
function getModalStyle() {
  const bottom = 65;
  const left = 108;
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
    console.log("News PROPS", props)   
  },[])

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
          <td onClick={()=> props.setShowNews(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2 }}/></td>
        </tr>
      </table>
      <iframe 
        style={{height:'80vh'}}
        src="https://www.kse.kg/ru/RussianNewsBlog/">          
      </iframe>
    </div>
  )
}