 
    import React from "react";
    import {convertFahToCel} from "../inc/Utilities";

    const TodayForecast = ({data, tempUnit}) => {
        // var forecast = forecasts.filter(obj => { return obj.id === id });
        // console.log('d',data)
        if(!data.name.includes('Night')){
            var temp = tempUnit === 'c' ? convertFahToCel(data.temperature) : data.temperature;
            return (
                <div>
                    <h2 style={{fontSize:"60px"}}>{temp} <sup style={{fontSize:"30px"}}>&deg;{tempUnit.toUpperCase()}</sup></h2>
                    <h1>{data.shortForecast}</h1>
                    <p>Wind: {data.windSpeed} {data.windDirection}</p>
                    <p>{data.detailedForecast} </p>
                </div>
            );
        }
        
    }

    export default TodayForecast;
