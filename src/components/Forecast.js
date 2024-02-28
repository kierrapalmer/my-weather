import React from "react";
import {convertFahToCel, abbreviateDay} from "../inc/Utilities";

const Forecast = ({data, tempUnit}) => {
    var forecastDate = new Date(data.startTime);
    var todaysDate = new Date();
    var isTodaysForecast = forecastDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0);

    if(!data.name.includes('Night') && !isTodaysForecast){
        var temp = tempUnit === 'c' ? convertFahToCel(data.temperature) : data.temperature;
        var columns = {
            "day" : abbreviateDay(data.name), 
            "temp" : temp + String.fromCharCode(176)  + tempUnit.toUpperCase(),
            "description" : data.shortForecast.length > 20 ? data.shortForecast.substring(0, 20) + '...' :  data.shortForecast,
            "wind" : data.windSpeed + " " + data.windDirection
        }

        return (                
            <tr direction="horizontal" gap={1}>
                {Object.keys(columns).map(index => (
                    <td key={index} style={{minWidth:"80px"}}>{columns[index]} </td>
                    )) }
            </tr>
        );
    }
    
}  

export default Forecast;
