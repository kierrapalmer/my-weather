//Converts Fahrenheit to Celcius
export function convertFahToCel(fah) {
    return Math.round((fah-32) / 1.8);
}

 //Converts full day string into abbreviation
export function abbreviateDay(fullDay){
    var days = {
        "Monday": "Mon", 
        "Tuesday": "Tue", 
        "Wednesday": "Wed", 
        "Thursday": "Thu", 
        "Friday": "Fri", 
        "Saturday": "Sat", 
        "Sunday": "Sun"
    }
    return days[fullDay] || fullDay;
}

