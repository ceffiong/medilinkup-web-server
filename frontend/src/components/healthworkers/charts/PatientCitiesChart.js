import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    ResponsiveContainer, ReferenceLine, Brush, ComposedChart, Label, Area, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Legend
  } from 'recharts';



const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(10)
      },
  }));

function PatientCitiesChart({ cities }){

    const classes = useStyles();
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    
    return (

    <div style={{ width: '95%', height: 300 }}>
        <ResponsiveContainer>
            
        <ComposedChart
                width={700}
                height={250}
                data={cities}
                margin={{
                top: 20, right: 20, bottom: 20, left: 20,
                }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="city" >
                    <Label value="Cities" offset={-0} position="insideBottomRight" />
                </XAxis>
                <YAxis label={{ value: 'No of patients', angle: -90, position: 'center' }} />
                <Tooltip />

                <ReferenceLine y={0} stroke='#000'/>                
                {cities.length > 0 && <Brush dataKey='city' height={30} stroke="#8884d8"/> }
                <Area type="monotone" dataKey="patient" fill={colors[1]} stroke={colors[3]} />
            </ComposedChart> 
        </ResponsiveContainer> 
    </div>
    ) 


        {/*<div style={{ display: 'flex', width: '70%', height: 335 }}>
            <ResponsiveContainer>
            <AreaChart
                width={700}
                height={400}
                data={cities}
                margin={{
                top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" >
                    <Label value="Cities" offset={-0} position="insideBottomRight" />
                </XAxis>
                <YAxis label={{ value: 'No of patients', angle: -90, position: 'center' }} />
                <Tooltip />
                <Brush dataKey='city' height={30} stroke="#8884d8"/> 
                <Area type="monotone" dataKey="patient" fill={colors[1]} stroke={colors[3]} />
            </AreaChart></ResponsiveContainer>
        </div> */}
    
}
 
export default PatientCitiesChart;

