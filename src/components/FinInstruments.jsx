import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { BiSkipNext } from 'react-icons/bi';
import { BiSkipPrevious } from 'react-icons/bi';
import { Grid } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import Select from 'react-select';
import Snackbar from '@material-ui/core/Snackbar';
//Стили заголовка
const useStyles = makeStyles((theme) => ({
  td:{
    backgroundColor:'#ffe8de',
    border:'solid 1px #f4511e',    
    fontFamily:'serif',
    fontSize:15,
    color:'#263238',
    paddingLeft:8,
    paddingRight:8,    
    // fontWeight:'bold'
  },
  td1:{
    backgroundColor:'#ffe8de',
    border:'solid 1px #FF6800',    
    fontFamily:'serif',
    fontSize:14,
    color:'#757575',
    paddingLeft:5,    
    width:'100%',
    
  }
}));

export default function FinInstruments(props) {
  const cls = useStyles();
  const [sectionColor] = useState("#B2E0C9")
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [docList, setDocList] = useState(null)
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [currIndex, setCurrIndex] = useState(0)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")

  // FIELDS
  const [fieldValue, setFieldValue] = useState({
    code: null
  })

  useEffect(async ()=>{
    let docL = await getFinInstruments()
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
      "name" : "code",
      "index": null
    }]
    for(let i=0; i<enums.length; i++){
      options.push({
        "value": enums[i].id,
        "label": enums[i].code,
        "name": "code",
        "index": i
      })
    }
    newEnumOptions["code"] = options
    console.log("ENUMS", newEnumOptions)
    setEnumOptions(newEnumOptions)
    // return newEnumOptions
  }

  async function getFinInstruments(){
    let docList = await fetch(kseRESTApi + "/api/FinanceInstruments", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      return res.data
    })
    .catch(function (error) {
      console.log("Collecting docList error: ", error)
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
      <Grid style={{borderTop:'groove 1px #1565c0'}}>
        <Select 
          placeholder= {'Поиск по коду'}
          name = {'code'}
          value = {selectedOptions['code']}
          onChange = {handleSelectChange}
          options = {enumOptions['code']}
        />
      </Grid>
      {docList !== null &&
        <Grid>        
          <table style={{width:'100%', border:'solid 1px #FF6800', color:'#fafafa', fontFamily:'serif', fontSize:18}}>          
            <th style={{backgroundColor:'#ff7043', border:'solid 1px #bf360c'}}>
              Инструменты
            </th>
          </table>           
            <table style={{border:'solid 1px #FF6800', color:'#f5f5f5', fontFamily:'serif', borderCollapse:'collapse'}}>
              <tr>
                <td className={cls.td}> Код </td>
                <td className={cls.td1}>{docList[currIndex].code}</td>       
              </tr>
              <tr>
                <td className={cls.td}> Эмитент </td>
                <td className={cls.td1}>{docList[currIndex].emitentName}</td>
              </tr>
              <tr>
                <td className={cls.td}> Coст. </td>
                <td className={cls.td1}>{docList[currIndex].tradeStatusId}</td>
              </tr>
              <tr>
                <td className={cls.td}> Предложение </td>
                <td className={cls.td1}>{docList[currIndex].offer}</td>
              </tr>
            </table>
          <Grid 
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          // style={{width:'100%', color:'#ff7043', fontSize:'25px', textAlign:'center'}}
          >
            <IconButton style={{padding:1, fontSize:22}} onClick={()=>LeftClick(currIndex)}>
              <BiSkipPrevious/>
            </IconButton>
              <tr style={{fontSize:12, maxWidth:50, borderColor:'white', textAlign:'center', paddingTop:2}}>{currIndex +1} / {docList.length} </tr>
            <IconButton style={{padding:1, fontSize:22}} onClick={()=>RightClick(currIndex)}>
              <BiSkipNext/>
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
