import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { IoMdArrowDropright} from 'react-icons/io';
import { IoMdArrowDropleft } from 'react-icons/io';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { Grid } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import Select from 'react-select';
import Snackbar from '@material-ui/core/Snackbar';
import Charts from './Charts.jsx';
import {AiFillGold} from 'react-icons/ai';
import {SiPandas} from 'react-icons/si';

//Стили заголовка
const useStyles = makeStyles((theme) => ({
  td:{    
    borderBottom:'solid 1px #ffd2c4',
    borderRight:'solid 1px #ffd2c4',
    fontFamily:'Roboto',
    fontSize:12,
    color:'#263238',
    paddingLeft:8,
    paddingRight:8
  },
  td1:{    
    borderBottom:'solid 1px #ffd2c4',
    fontFamily:'Roboto',
    fontSize:11,
    color:'#757575',
    paddingLeft:5,
    width:'100%'  
  }
}));

export default function FinInstruments(props) {
  const cls = useStyles();
  const [sectionColor] = useState("#B2E0C9")
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token] = useState(props.token)
  const [docList, setDocList] = useState(null)
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [currIndex, setCurrIndex] = useState(0)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [quotation, setQuotation] = useState(null)
  const [quotationKey, setQuotationKey] = useState(null)  
  const [charts, setCharts] = useState(false)
  const [showCharts, setShowCharts] = useState(false)

  // FIELDS
  const [fieldValue, setFieldValue] = useState({
    code: null
  })

  useEffect(async ()=>{
    let docL = await getFinInstruments()
    setDocList(docL)
    createEnumOptions(docL)
    let quot = await getFinInstrumentsQuotation(docL[currIndex].code)
    setQuotation(quot)
    console.log('CODE', docL[currIndex].code)
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

  async function getFinInstrumentsQuotation(code){
    let quotationList = await fetch(kseRESTApi + "/api/Trading/GetInstrumentQuotation?instrumentCode=" + code, 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){      
      return res.data
    })
    .catch(function (error) {
      console.log("Collecting quotationList error: ", error)
      return []
    })
    console.log("QUOT", quotationList)
    return quotationList
  }
 
  //ОБЩЕЕ КОЛИЧЕСТВО ИНСТРУМЕНТОВ  
  async function LeftClick(currIndex){
    if(currIndex > 0){
      setCurrIndex(currIndex - 1)
      let quot = await getFinInstrumentsQuotation(docList[currIndex - 1].code)
      setQuotation(quot)
    }
    else{
      setSnackBarMessage("Вы на первой записи!")
      setShowSnackBar(true)
    }
  }
  async function RightClick(currIndex){
    if(currIndex === docList.length - 1){
      console.log("NO DATA", currIndex > docList.length-1)
      setSnackBarMessage("Больше нет записей!")
      setShowSnackBar(true)
    } 
    else{
      let quot = await getFinInstrumentsQuotation(docList[currIndex + 1].code)
      setQuotation(quot) 
      setCurrIndex(currIndex + 1)
    }    
  }  

  /*ОТРИСОВКА*****************************************************************************************************************************************/
  return (    
    <div>      
      <Grid>
        <Grid>
          <Select 
            placeholder= {'Поиск по коду'}
            name = {'code'}
            value = {selectedOptions['code']}
            onChange = {handleSelectChange}
            options = {enumOptions['code']}
            style = {{maxHeight:'10'}}
          />
        </Grid>        
      </Grid>
      {docList !== null &&
        <Grid>        
          <table style={{width:'100%', color:'#424242', fontWeight:'bold', fontFamily:'Roboto', fontSize:12, borderCollapse: "collapse"}}>          
            <tr style={{backgroundColor:'#ffd2c4'}}>
              <td style={{ paddingLeft:5, width:21}}><AiFillGold size={15} style={{color:'#dd2c00', marginTop:2}}/></td>
              <td>Инструменты</td>
              <td align='right' style={{backgroundColor:'#ffd2c4'}}>
                <AiOutlineAreaChart 
                  size='18'
                  style={{color:'#1266F1', fontWeight:'bold'}}
                  onClick ={()=> setShowCharts(!showCharts)}
                />
              </td>
            </tr>            
          </table>           
          <table style={{color:'#f5f5f5', fontFamily:'Roboto', borderCollapse:'collapse'}}>
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
            {/* <tr>
              <td className={cls.td}> Предложение </td>
              <td className={cls.td1}>{docList[currIndex].offer}</td>
            </tr> */}
          </table>
          <Grid 
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='center'          
          >
            <IconButton style={{padding:1, fontSize:19}} onClick={()=>LeftClick(currIndex)}>
              <IoMdArrowDropleft/>
            </IconButton>
              <tr style={{fontSize:10, clolor:'#757575', maxWidth:50, borderColor:'white', textAlign:'center', paddingTop:2}}>{currIndex +1} / {docList.length} </tr>
            <IconButton style={{padding:1, fontSize:19}} onClick={()=>RightClick(currIndex)}>
              <IoMdArrowDropright/>
            </IconButton>
          </Grid>        
        </Grid>
      }
      {quotation !== null &&
      <Grid>        
        <table style={{width:'100%', color:'#424242', fontWeight:'bold', fontFamily:'Roboto', fontSize:12, borderCollapse:'collapse'}} key={quotationKey}>
          <tr style={{backgroundColor:'#ffd2c4'}}>
            <td style={{ paddingLeft:5, width:21}}><SiPandas size={14} style={{color:'#dd2c00', marginTop:2}}/></td>              
            <td>Котировка</td>              
          </tr>         
        </table>          
        <tr>
          <td className={cls.td}> Продажа(S) </td>                
          <td className={cls.td}> Цена </td>
          <td className={cls.td}> Покупка(B) </td>                
        </tr>
        <tbody>
          {quotation.map(q =>
            <tr>
              <td className={cls.td1}> {q.sell} </td>
              <td className={cls.td1}> {q.price} </td>
              <td className={cls.td1}> {q.buy} </td>
            </tr>)}
        </tbody>
      </Grid>
      }
      {showCharts === true &&
        <Charts
          kseRESTApi={props.kseRESTApi}
          token={props.token}
          userProfile={props.userProfile}
          code={docList[currIndex].code}
          setShowCharts={setShowCharts}
        />
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
