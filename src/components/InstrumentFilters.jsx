import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CheckboxTree from 'react-checkbox-tree'; // https://www.npmjs.com/package/react-checkbox-tree
import Checkbox from '@material-ui/core/Checkbox';
// Icons
import { MdExpandLess } from 'react-icons/md';
import { MdExpandMore } from 'react-icons/md';
import { GiPapers } from 'react-icons/gi';
import { AiFillFolderOpen } from 'react-icons/ai';
import { AiFillFolder } from 'react-icons/ai';
import { IoIosCloseCircleOutline } from 'react-icons/io';

// Library
import "../styles/generalStyles.css"
import { v4 as uuidv4 } from 'uuid';
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: '96%',
    height:'85vh',
    borderRadius: "7px",
    border: '1px solid #d7ccc8',
    boxShadow: theme.shadows[1],
    fontFamily:'Roboto',
    fontSize:12,
    background:'#FFFAFA'
  },
  rctIconExpandClose: {
    content: "\f054"
  },
  rctIconExpandOpen: {
    content: "\f078"
  }
}))

//Home(props) - получаем переменные от родителя App.js 
export default (props) => {
  const classes = useStyles()
  const [token] = useState(props.token)
  const [kseRESTApi] = useState(props.kseRESTApi) //Local KFB main REST
  const [userProfile, setUserProfile] = useState(props.userProfile)
  const [instrumentFilters, setInstrumentFilters] = useState(props.instrumentFilters)
  const [checked, setChecked] = useState([])
  const [expanded, setExpanded] = useState(["markets"])
  const [nodes, setNodes] = useState([])
  const [treeKey, setTreeKey] = useState(null)
   
  // FIELDS
  const [fieldValue, setFieldValue] = useState({}) 
  function getModalStyle() {
    const top = 7;
    const left = 2;
    return {
      top: `${top}%`,
      left: `${left}%`,
      zIndex: 20  
    };
  } 

  useEffect(async()=>{
    console.log("INST FILTERS PROPS", props)
    let enumDataToCollect = [
      {enumName: "markets", enumDef: "ab14dc6d-0139-4dd4-ab65-172cacb636f8"},
      {enumName: "sectors", enumDef: "df59dde0-68fd-4a8b-84e1-aa33531d2fe6"},
      {enumName: "groups", enumDef: "3e66280f-9295-46af-8855-cfce4d98faf1"},
      {enumName: "instruments", enumDef: "3e819d7e-25d0-4a04-a3ff-092fd348a375"},
    ]
    let enums = await props.getEnumDataByList(enumDataToCollect)
    createTree(enums)
  },[])
  
  function swAllert(text, icon){
    return(
      swal({
        text: text,
        icon: icon,
        buttons: {ok: "Ок"},
      })
    )
  }
  function createTree(enums){
    console.log("EN FILTERS", enums)
    let newNode = [{
      value: 'markets',
      label: 'Рынки',
      children: []
    }]
    // Push children to their levels
    for(let m=0; m<enums.markets.length; m++){
      let newMarket = {
        value: "market#" + enums.markets[m].id,
        label: enums.markets[m].label,
        children: []
      }
      newNode[0].children.push(newMarket)
      for(let s=0; s<enums.sectors.length; s++){
        if(enums.sectors[s].market === enums.markets[m].id){
          let newSector = {
            value: "sector#" + enums.sectors[s].id,
            label: enums.sectors[s].label,
            children: []
          }
          newMarket.children.push(newSector)
          for(let g=0; g<enums.groups.length; g++){
            if(enums.groups[g].sector === enums.sectors[s].id){
              let newGroup = {
                value: "group#" + enums.groups[g].id,
                label: enums.groups[g].label,
                children: []
              }
              newSector.children.push(newGroup)
              for(let i=0; i<enums.instruments.length; i++){
                if(enums.instruments[i].group === enums.groups[g].id){
                  let newInstrument = {
                    value: "instrument#" + enums.instruments[i].id,
                    label: enums.instruments[i].label,
                  }
                  newGroup.children.push(newInstrument)
                }
              }
            }
          }
        }
      }
    }
    // Clear empty levels
    for(let markets=0; markets<newNode[0].children.length; markets++){
      if(newNode[0].children[markets].children.length === 0){ // Check for empty markets
        newNode[0].children[markets] = {
          value: newNode[0].children[markets].value,
          label: newNode[0].children[markets].label
        }
      }
      else{
        for(let sectors=0; sectors<newNode[0].children[markets].children.length; sectors++){ // Check for empty sectors
        if(newNode[0].children[markets].children[sectors].children.length === 0){
          newNode[0].children[markets].children[sectors] = {
            value: newNode[0].children[markets].children[sectors].value,
            label: newNode[0].children[markets].children[sectors].label
          }
        }
        else{
          for(let groups=0; groups<newNode[0].children[markets].children[sectors].children.length; groups++){ // Check for empty groups
            if(newNode[0].children[markets].children[sectors].children[groups].children.length === 0){
              newNode[0].children[markets].children[sectors].children[groups] = {
                value: newNode[0].children[markets].children[sectors].children[groups].value,
                label: newNode[0].children[markets].children[sectors].children[groups].label
              }
            }
          }
        }
      }
      }
      
    }
    setNodes(newNode)
    console.log("NEW NODE", newNode)
    // if(Object.keys(instrumentFilters).length > 0){
    //   let newChecked = []
    //   for(let m=0; m<instrumentFilters.markets.length; m++){
    //     newChecked.push("market#" + instrumentFilters.markets[m])
    //   }
    //   for(let s=0; s<instrumentFilters.marketSectors.length; s++){
    //     newChecked.push("sector#" + instrumentFilters.marketSectors[s])
    //   }
    //   for(let g=0; g<instrumentFilters.instrumentGroups.length; g++){
    //     newChecked.push("group#" + instrumentFilters.instrumentGroups[g])
    //   }
    //   for(let i=0; i<instrumentFilters.financeInstruments.length; i++){
    //     newChecked.push("instrument#" + instrumentFilters.financeInstruments[i])
    //   }
    //   console.log("CHECKED", newChecked)
    //   setChecked(newChecked)
    // }
  }
  // random UUID generator
  function getUUID(){
    return uuidv4()
  }
  function saveFilters(){
    console.log("CHECKED", checked)
    let filters = {
      markets: [],
      marketSectors: [],
      instrumentGroups: [],
      financeInstruments:[]
    }
    for(let c=0; c<checked.length; c++){
      let checkedItem = checked[c].split("#")
      // console.log("checkedItem", checkedItem)
      if(checkedItem[0] === "market"){
        filters.markets.push(parseInt(checkedItem[1]))
      }
      if(checkedItem[0] === "sector"){
        filters.marketSectors.push(parseInt(checkedItem[1]))
      }
      if(checkedItem[0] === "group"){
        filters.instrumentGroups.push(parseInt(checkedItem[1]))
      }
      if(checkedItem[0] === "instrument"){
        filters.financeInstruments.push(parseInt(checkedItem[1]))
      }
    }
    // console.log("filters", filters)
    let settings = {
      type: "instrumentFilters",
      instrumentFilters: filters
    }
    props.updateUserSettingsByType(settings)
    props.setShowInstrumentFilters(false)
  }
  
  return(    
    <div style={getModalStyle()} className={classes.modal}>
      <table style={{backgroundColor:'#ff7043'}}>
        <tr>      
          <td
            width="99%" 
            style={{width:'100%', color:'white', fontFamily:'Roboto', fontSize:14, fontWeight:'bold', textAlign:'center'}}>
              Фильтрация инструментов
            </td>
          <td onClick={()=> props.setShowInstrumentFilters(false)}><IoIosCloseCircleOutline size='20px' style={{color:'white', paddingTop:2 }}/></td>
        </tr>
      </table>
      <table align="center" width="100%">
        <tr>
          <td>
            <div style={{height: "505px", overflow: "auto"}}>
              <CheckboxTree
                style={{background:'red'}}
                key={treeKey}
                nodes={nodes}
                checked={checked}
                expanded={expanded}
                // optimisticToggle={true}
                onCheck={(checked)=> setChecked(checked)}
                onExpand={(expanded)=> setExpanded(expanded)}
                // expandOnClick={true}
                nativeCheckboxes={true}
                icons={{
                  // check: <span className="rct-icon rct-icon-check" />,
                  // uncheck: <span className="rct-icon rct-icon-uncheck" />,
                  // halfCheck: <span className="rct-icon rct-icon-half-check" />,
                  expandClose: <span className="rct-icon rct-icon-expand-close" />,
                  expandClose: <MdExpandMore className="rct-icon rct-icon-expand-close"/>,
                  expandOpen: <MdExpandLess className="rct-icon rct-icon-expand-open" />,
                  // expandAll: <span className="rct-icon rct-icon-expand-all" />,
                  // collapseAll: <span className="rct-icon rct-icon-collapse-all" />,
                  parentClose: <AiFillFolder className="rct-icon rct-icon-parent-close" />,
                  parentOpen: <AiFillFolderOpen className="rct-icon rct-icon-parent-open" />,
                  leaf: <GiPapers className="rct-icon rct-icon-leaf" />,
                }}
              />
            </div>
          </td>
        </tr>
      </table>
      <table width="100%" style={{marginTop:30}}>
        <tr align="center">
          <td>
            <Button
              variant="contained"                      
              onClick = {()=> saveFilters()}
              style={{
                margin: 5,
                height: 27,
                fontSize: 10,
                color: "white",
                backgroundColor: "green",
                border:'solid 1px #1b5e20',
                fontFamily: 'Roboto'
              }}
            >Сохранить
            </Button>
            <Button
                variant="contained"                         
                onClick = {()=> props.setShowInstrumentFilters(false)}
                style={{
                  margin: 5,
                  height: 27,
                  fontSize: 10,
                  color: "white",
                  backgroundColor: "#dd2c00",
                  border:'solid 1px #bf360c',
                  fontFamily: 'Roboto'
                }}
              >Отмена
            </Button>
          </td>
        </tr>
      </table>        
    </div>
  )
}