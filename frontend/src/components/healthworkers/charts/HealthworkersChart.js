import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    Scatter, ResponsiveContainer, ReferenceLine, Brush, ComposedChart, Legend, Area, Line, BarChart, Label, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
  } from 'recharts';



const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(10)
      },
  }));


function HealthworkersChart({ healthworkers }){

    const classes = useStyles();
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

    
    //read only form for loggout users or login users who accesses another user's page
    return (
        <div style={{ width: '95%', height: 335 }}>
            <ResponsiveContainer>
                <ComposedChart
                    width={700}
                    height={250}
                    data={healthworkers}
                    margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="country" >
                        <Label value="Countries" offset={-0} position="insideBottomRight" />
                    </XAxis>
                    <YAxis label={{ value: 'No of patients', angle: -90, position: 'center' }} />
                    <Tooltip />
                    <Legend />

                    <ReferenceLine y={0} stroke='#000'/>
  
                    {healthworkers.length > 0 && <Brush dataKey='country' height={15} stroke="#8c564b"/> }
                    
                    <Line type="monotone" dataKey="patient" stroke="#ff7300" strokeWidth={2}/>

                    <Bar dataKey="healthworker" fill="#8884d8"></Bar>
                </ComposedChart>

            </ResponsiveContainer>

        </div>
    )
}
 
export default HealthworkersChart;

