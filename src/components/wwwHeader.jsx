import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from '../pages/logo.png';

//Стили заголовка
const useStyles = makeStyles((theme) => ({
  div: {
    // borderBottom:'ridge 2px #1565c0',
    border:'ridge 1px red'
  },
  appBar: {    
    background: 'linear-gradient(35deg, #514A9D, #24C6DC)'    
  },
  title: {
    fontFamily: 'Roboto',
    color:'#fafafa',
    textAlign:'center',
    textShadow:'2px 2px #514A9D'
  }
}));

export default function Header() {
  const cls = useStyles();
  return (
    <div>
      <img src={logo} alt='Logo' />
      <Typography variant='h5' className={cls.title}>
            Кыргызская Фондовая Биржа
      </Typography>
      {/* <AppBar position='static' className={cls.appBar}>      
        <Toolbar style={{paddingLeft:1}}>
          <img src={logo} alt='Logo'/>
          <Typography variant='h5' className={cls.title}>
            Кыргызская Фондовая Биржа
          </Typography>
        </Toolbar>
      </AppBar> */}
    </div>
  );
}
