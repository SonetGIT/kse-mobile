import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { IoMdArrowDropright} from 'react-icons/io';
import { IoMdArrowDropleft } from 'react-icons/io';
import { Grid } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import {GoBriefcase} from 'react-icons/go';

//Стили заголовка
const useStyles = makeStyles((theme) => ({
  td:{    
    borderBottom:'solid 1px #ffd6c9',
    borderRight:'solid 1px #ffd6c9',
    fontFamily:'Roboto',
    fontSize:12,
    color:'#263238',
    paddingLeft:8,
    paddingRight:8
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

export default function Briefcase(props) {
  const cls = useStyles();
  const [kseRESTApi] = useState(props.kseRESTApi)
  console.log("API:", kseRESTApi)
  const [docList, setDocList] = useState(null)
  const [enumData, setEnumData] = useState({})
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [currIndex, setCurrIndex] = useState(0)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")

  // FIELDS
  const [fieldValue, setFieldValue] = useState({
    instrumentCode: null
  })

  useEffect(async ()=>{
    let docL = await getActiveBids()
    setDocList(docL)
    let enumDataToCollect = [
      {enumName: 'organizationId', enumDef:'5b78d9dd-821d-4c6a-a00a-3af85224fbc4'},
      {enumName: 'financeInstrument', enumDef: '3e819d7e-25d0-4a04-a3ff-092fd348a375'},
    ]
    let enums = await props.getEnumDataByList(enumDataToCollect)
    setEnumData(enums)
    let eOpts = await props.createEnumOptions(enums)
    setEnumOptions(eOpts)    
    console.log("Enums", enums) 
    console.log('DOCL', docL)   
  },[])
  
  function getEnumLabel(name, id){
    for(let d=0; d<enumData[name].length; d++){
      if(enumData[name][d].id === id){
        return enumData[name][d].label
      }
    }
  }

  function handleCloseSnackBar(){
    setShowSnackBar(false)
  } 

  async function getActiveBids(){
    let docList = await fetch(kseRESTApi + "/api/Accounts/ViewInstruments", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      return res.data
    })
    .catch(function (error) {
      console.log("Collecting docList GetViewInstruments error: ", error)
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

  /*ОТРИСОВКА*****************************************************************************************************************************************/
  return (
    <div>
      {docList !== null && Object.keys(enumData).length > 0 &&
        <Grid>
          <table style={{width:'100%', color:'#424242', fontWeight:'bold', fontFamily:'Roboto', fontSize:12, borderCollapse:'collapse', marginTop:47}}>
            <tr style={{backgroundColor:'#ffd6c9'}}>
              <td style={{paddingLeft:7, width:24}}><GoBriefcase size={15} style={{color:'#dd2c00', marginTop:2}}/></td>              
              <td>Позиции по инструментам</td>              
            </tr>
          </table>
          {docList.length !== 0 &&
            <table style={{color:'#f5f5f5', fontFamily:'Roboto', borderCollapse:'collapse'}}>
              <tr>
                <td className={cls.td}> Организация </td>
                <td className={cls.td1}>{getEnumLabel('organizationId', docList[currIndex].organizationId)}</td>       
              </tr>
              <tr>
                <td className={cls.td}> Фин. инс-т </td>
                <td className={cls.td1}>{getEnumLabel('financeInstrument', docList[currIndex].financeInstrumentId)}</td>
              </tr>
              <tr>
                <td className={cls.td}> Счет </td>
                <td className={cls.td1}>{docList[currIndex].accountNo}</td>
              </tr>
              <tr>
                <td className={cls.td}> Количество </td>
                <td className={cls.td1}>{docList[currIndex].quantity}</td>
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
  );
}
