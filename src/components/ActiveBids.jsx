import React, {useState, useEffect} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { IoMdArrowDropright} from 'react-icons/io';
import { IoMdArrowDropleft } from 'react-icons/io';
import {ImStackoverflow} from 'react-icons/im';
import {MdDeleteSweep} from 'react-icons/md';
import {FaEllipsisV} from 'react-icons/fa';
import {GiBuyCard} from 'react-icons/gi';
import {GiSellCard} from 'react-icons/gi';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Grid } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import Select from 'react-select';
import OrderBuy from './OrderBuy.jsx';
import OrderSell from './OrderSell.jsx';
import Snackbar from '@material-ui/core/Snackbar';
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import { v4 as uuidv4 } from 'uuid';

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

export default function ActiveBids(props) {
  const cls = useStyles();
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token] = useState(props.token)
  const [getEnumDataByList] = useState(props.getEnumDataByList)
  // const [createEnumOptions]=useState(props.createEnumOptions)
  const [callSuccessToast]=useState(props.callSuccessToast)
  const [callErrorToast]=useState(props.callErrorToast)
  console.log("API:", kseRESTApi)
  const [docList, setDocList] = useState(null)
  const [enumOptions, setEnumOptions] = useState({})
  const [selectedOptions, setSelectedOptions] = useState({})
  const [currIndex, setCurrIndex] = useState(0)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [selectedBid, setSelectedBid] = useState({bidId: null})
  const [activeBidsKey, setActiveBidsKey] = useState(null)
  const [showOpenEllipsis, setShowOpenEllipsis] = useState(false)
  const [showOrderBuy, setShowOrderBuy] = useState(false)
  const [showOrderSell, setShowOrderSell] = useState(false)

  // FIELDS
  const [fieldValue, setFieldValue] = useState({
    instrumentCode: null
  })

  useEffect(async ()=>{
    // let docL = await getActiveBids()
    getActiveBids()
    // setDocList(docL)
    // createEnumOptions(docL)
    // console.log("DOCL BIDS", docL)    
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

  function getUUID(){
    return uuidv4()
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
    await fetch(kseRESTApi + "/api/Trading/GetActiveBids", 
      {
        "headers": { "content-type": "application/json", "Authorization": "Bearer " + props.token }
      }
    )
    .then(response => response.json())
    .then(function(res){
      setDocList(res.data)
      setCurrIndex(0)
      setActiveBidsKey(getUUID())
      // return res.data
    })
    .catch(function (error) {
      console.log("Collecting docList GetActiveBids error: ", error)
      return []
    })
    return docList
  }

  function cancelBid(){
    swal({
      text: "Вы точно хотите снять заявку?",
      icon: "warning",
      buttons: {yes: "Да", cancel: "Отмена"}
    })
    .then(async(click) => {
      if(click === "yes"){
        await fetch(kseRESTApi + "/api/Trading/CancelOrder?bidId=" + docList[currIndex].bidId,
          {
            "headers": { "content-type": "application/json", "Authorization": "Bearer " + token},
          }
        )
        .then(response => response.json())
        .then(function(res){
            console.log("Cancel bid", res)
            if(res.isSuccess === true){
              props.callSuccessToast("Заявка снята!")
              //handleCloseMenu()
              getActiveBids()
            }
            else{
              props.callErrorToast(res.errors[0])
            }
          }
        )
      }
    })
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
    <div key={activeBidsKey}>      
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
          <table style={{width:'100%', color:'#424242', fontWeight:'bold', fontFamily:'Roboto', fontSize:12, borderCollapse: "collapse"}}>
            <tr style={{backgroundColor:'#ffd2c4'}}>
              <td style={{ paddingLeft:7, width:24}}><ImStackoverflow size={13} style={{color:'#dd2c00', marginTop:2}}/></td>              
              <td>Заявки</td>          
              <td align='right' style={{backgroundColor:'#ffd2c4'}}>
                <FaEllipsisV 
                  size={13}
                  onClick={()=> setShowOpenEllipsis(!showOpenEllipsis)}
                  style={{color:'#dd2c00', fontWeight:'bold', paddingTop:2}}
                />
              </td>
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
                <td className={cls.td1}>{docList[currIndex].direction}</td>
              </tr>
              <tr>
                <td className={cls.td}> Цена </td>
                <td className={cls.td1}>{docList[currIndex].price}</td>
              </tr>
              <tr>
                <td className={cls.td}> Количество </td>
                <td className={cls.td1}>{docList[currIndex].amount}</td>
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
              <tr style={{fontSize:10, clolor:'#757575', maxWidth:50, borderColor:'white', textAlign:'center', paddingTop:2}}>{currIndex +1} / {docList.length} </tr>
            <IconButton style={{padding:1, fontSize:19}} onClick={()=>RightClick(currIndex)}>
              <IoMdArrowDropright/>
            </IconButton>
          </Grid>        
        </Grid>
      }
      {showOpenEllipsis === true &&
        <MenuList align='right'>
          <MenuItem align='right' onClick ={()=> setShowOrderBuy(!showOrderBuy)} style={{fontSize:12, fontFamily:'Roboto'}}>
            <GiBuyCard 
              size='14'
              style={{color:'#dd2c00', marginRight:4}}
              onClick ={()=> setShowOrderBuy(!showOrderBuy)}
            />
            Купить
          </MenuItem>
          <MenuItem onClick ={()=> setShowOrderSell(!showOrderSell)} style={{fontSize:12, fontFamily:'Roboto'}}>
            <GiSellCard
              size='14'
              style={{color:'#dd2c00', marginRight:4}}
              onClick ={()=> setShowOrderSell(!showOrderSell)}
            />
            Продать
          </MenuItem>
          <MenuItem onClick={()=> cancelBid()} style={{fontSize:12, fontFamily:'Roboto'}}>
            <MdDeleteSweep 
              size='14'
              style={{color:'#dd2c00', marginRight:4}}
              onClick={()=> cancelBid()}
            />
            Отменить
          </MenuItem>
        </MenuList>
      }
      {showOrderBuy === true &&
        <OrderBuy
          // VARS
          kseRESTApi={props.kseRESTApi}
          token={props.token}
          userProfile={props.userProfile}
          // FUNCTIONS
          setShowOrderBuy={setShowOrderBuy}
          getEnumDataByList={props.getEnumDataByList}
          createEnumOptions={props.createEnumOptions}
          callSuccessToast={props.callSuccessToast}
          callErrorToast={props.callErrorToast}
        />
      }
      {showOrderSell === true &&
        <OrderSell
          kseRESTApi={props.kseRESTApi}
          token={props.token}
          userProfile={props.userProfile}
          setShowOrderSell={setShowOrderSell}
          getEnumDataByList={props.getEnumDataByList}
          createEnumOptions={props.createEnumOptions}
          callSuccessToast={props.callSuccessToast}
          callErrorToast={props.callErrorToast}
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
