
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
// Icons
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { IoIosCloseCircleOutline } from 'react-icons/io';

// Library
import { ResponsiveLine } from '@nivo/line' // https://nivo.rocks/line/

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: '100%',
    height: 220,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #AFAFAF'   
  }
}))
function getModalStyle() {
  const top = 24;
  return {
    top: `${top}%`,
    zIndex: 1
  };
}
export default (props) => {
  const classes = useStyles() 
  const [kseRESTApi] = useState(props.kseRESTApi)
  const [token] = useState(props.token)
  const [userProfile] = useState(props.userProfile)
  const [instrument] = useState(props.instrument)
  const [data, setData] = useState(null) 
  const [modalStyle] = useState(getModalStyle)
  useEffect(()=>{
    console.log("CHARTS PROPS", props)
    fetchChartData(props.code)
  },[])
  function fetchChartData(code){
    fetch(kseRESTApi + "/api/Charts/BidLineData?instrumentCode=" + code, 
      {
        "headers": { "content-type": "application/json" }
      }
    )
    .then(response => response.json())
    .then(function(res){
      setData(res.data)    
    })
  }
  if(data !== null){
    return(
      <div>
        <div style={modalStyle} className={classes.modal}>
          <table width="100%" style={{backgroundColor:'#ff7043'}}>
            <tr height='3'> 
              <td align='center' width="99%" style={{fontSize:11, color:'white'}}>{props.code}</td>
              <td align="right" onClick={()=> props.setShowCharts(false)}>
                <IoIosCloseCircleOutline 
                 style={{paddingTop:4, marginRight:4, color:'white'}}
                 size='22px'/>
              </td>
            </tr>
          </table>
          <ResponsiveLine
            data={data}
            margin={{ top: 5, right: 70, bottom:50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            yFormat=" >-.2f"
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 2,
              tickPadding: 2,
              tickRotation: 0,
              legend: 'Дата',
              legendOffset: 36,
              legendPosition: 'middle',
              legendAnchor:'right'
            }}
            axisLeft={{
              orient: 'left',
              // tickSize: 2,
              // tickPadding: 2,
              tickRotation: 0,
              legend: 'Цена',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'pink_yellowGreen' }}
            lineWidth={1}
            pointSize={2}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            areaBlendMode="screen"
            useMesh={true}
            legends={[
              {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 5,
                itemOpacity: 0.95,
                symbolSize: 7,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
    )
  }
  else{
    return(
      <div>Загрузка...</div>
    )
  }
}