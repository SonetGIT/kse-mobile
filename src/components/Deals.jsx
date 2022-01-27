import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { IoMdArrowDropright} from 'react-icons/io';
import { IoMdArrowDropleft } from 'react-icons/io';
import {FaHandshake} from 'react-icons/fa';
import { Grid } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import Select from 'react-select'; // https://react-select.com/home
import Snackbar from '@material-ui/core/Snackbar';
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

export default function ActiveBids(props) {
  const cls = useStyles();
  const [kseRESTApi] = useState(props.kseRESTApi)
  console.log("API:", kseRESTApi)
  const [docList, setDocList] = useState(null)
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
    createEnumOptions(docL)
    console.log("DOCL INSTR", docL)    
  },[])
  
  function handleSelectChange(option){
    setSelectedOptions({...selectedOptions, [option.name]: option})
    setFieldValue({...fieldValue, [option.name]: option.value})
    setCurrIndex(option.index)
    console.log("OPT", {[option.name]: option.value})
    // console.log("OPT", option, fieldValue)
  }
  function handleCloseSnackBar(){
    setShowSnackBar(false)
  }

  async function createEnumOptions(enums){   
    let newEnumOptions = {}
    let options = [{
      "value": null,
      "label": "Пусто",
      "name" : "instrumentCode",
      "index": null
    }]
    for(let i=0; i<enums.length; i++){
      options.push({
        "value": enums[i].id,
        "label": enums[i].instrumentCode,
        "name": "instrumentCode",
        "index": i
      })
    }
    newEnumOptions["instrumentCode"] = options
    console.log("ENUMS", newEnumOptions)
    setEnumOptions(newEnumOptions)
    // return newEnumOptions
  }

  async function getActiveBids(){
    let docList = await fetch(kseRESTApi + "/api/Trading/GetDeals", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      return res.data
    })
    .catch(function (error) {
      console.log("Collecting docList GetDeals error: ", error)
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
      <Grid>
        <Select 
          placeholder= {'Поиск по коду'}
          name = {'instrumentCode'}
          value = {selectedOptions['instrumentCode']}
          onChange = {handleSelectChange}
          options = {enumOptions['instrumentCode']}
        />
      </Grid>
      {docList !== null &&
        <Grid>        
          <table style={{width:'100%', color:'#424242', fontWeight:'bold', fontFamily:'Roboto', fontSize:12, borderCollapse:'collapse'}}>
            <tr style={{backgroundColor:'#ffd6c9'}}>
              <td style={{ paddingLeft:7, width:24}}><FaHandshake size={16} style={{color:'#dd2c00', marginTop:3}}/></td>              
              <td>Сделки</td>
            </tr>
          </table> 
          {docList.length !== 0 &&
            <table style={{color:'#f5f5f5', fontFamily:'Roboto', borderCollapse:'collapse'}}>
              <tr>
                <td className={cls.td}> Код </td>
                <td className={cls.td1}>{docList[currIndex].instrumentCode}</td>       
              </tr>
              <tr>
                <td className={cls.td}> B/S </td>
                <td className={cls.td1}>{docList[currIndex].bidDirection}</td>
              </tr>
              <tr>
                <td className={cls.td}> Сумма </td>
                <td className={cls.td1}>{docList[currIndex].sum}</td>
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
              <tr style={{fontSize:10, clolor:'#757575', clolor:'#757575', maxWidth:50, borderColor:'white', textAlign:'center'}}>{currIndex +1} / {docList.length} </tr>
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
