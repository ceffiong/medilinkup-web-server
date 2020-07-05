import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
    ResponsiveContainer, ReferenceLine, Brush, BarChart, Label, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
  } from 'recharts';



const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(10)
      },
  }));

function PatientsChart({ patients }){

    const classes = useStyles();
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

    
    //read only form for loggout users or login users who accesses another user's page
    return (
        <div style={{ width: '95%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart width={700} height={250} data={patients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country">
                        <Label value="Countries" offset={-0} position="insideBottom" />
                    </XAxis>

                    <YAxis label={{ value: 'No of patients', angle: -90, position: 'center' }} />
                    
                    <Tooltip />
                    <ReferenceLine y={0} stroke='#000'/>
                    {patients.length > 0 && <Brush dataKey='country' height={15} stroke="#ff7f0e"/> }

                    
                    <Bar dataKey="patient" fill="#8884d8">
                        {patients.map((p, i) => {
                            return <Cell key={i} fill={colors[i % 20]}/>
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}
 
export default PatientsChart;

