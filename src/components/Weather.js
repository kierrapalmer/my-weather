import React, { useState, useEffect } from "react";
import {
  Container,
  Col,
  Row,
  Button,
  Form,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import Forecast from "../components/Forecast";
import TodayForecast from "../components/TodayForecast";

let background = {
  rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  sun: "https://images.unsplash.com/reserve/m6rT4MYFQ7CT8j9m2AEC_JakeGivens%20-%20Sunset%20in%20the%20Park.JPG?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  cloudy:
    "https://images.unsplash.com/photo-1609931029597-245a6b667e24?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  snow: "https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const WeatherComponent = (props) => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, long: null });
  const [forecasts, setForecasts] = useState(null);
  const [weatherImage, setWeatherImage] = useState(background["rain"]);
  const [isLoading, setLoading] = useState(false);
  const [tempUnit, setTempUnit] = useState("f");

  useEffect(() => {
    //Converts Lat/Long coordinates into a weather forecast
    async function getWeather() {
      try {
        if (coordinates?.lat && coordinates?.long) {
          const response = await fetch(
            `https://api.weather.gov/points/${coordinates?.lat},${coordinates?.long}`,
          ).then((res) => res.json());

          if (response?.properties?.forecast) {
            fetch(response.properties.forecast)
              .then((res) => res.json())
              .then((json) => {
                if (json.properties) {
                  let periods = json.properties.periods;
                  let shortForecast = periods[0].shortForecast.toLowerCase();
                  // console.log(periods);
                  setForecasts(periods);
                  if (shortForecast.includes("rain")) {
                    setWeatherImage(background["rain"]);
                  } else if (shortForecast.includes("snow")) {
                    setWeatherImage(background["snow"]);
                  } else if (shortForecast.includes("cloudy")) {
                    setWeatherImage(background["cloudy"]);
                  } else {
                    setWeatherImage(background["sun"]);
                  }
                }
                setLoading(false);
              });
          } else {
            throw new Error(
              "We couldn't find your location. Please try again.",
            );
          }
        } else {
          throw new Error(
            "There was an error retrieving your location data. Please try again.",
          );
        }
      } catch (error) {
        console.log(error);
        alert(error);
        setLoading(false);
      }
    }

    if (coordinates?.lat && coordinates?.long) {
      getWeather();
    }
  }, [coordinates]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      //Check if they entered a zip, if so, add 'US' to limit the search
      var newAddress = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(address)
        ? address + ", USA"
        : address;

      //Get Lat/Long Coordinates from search input
      if (newAddress) {
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${newAddress}&limit=2&format=json`,
        )
          .then((response) => response.json())
          .then((json) => {
            if (json.length > 0) {
              var result = json[0];
              setCoordinates({
                lat: result?.lat,
                long: result?.lon,
              });
            }
          });
      } else {
        alert("Please enter a location");
      }
    } catch (error) {
      console.log(error);
      alert("There was an error retrieving your location. Please try again.");
      setLoading(false);
    }
  };

  const styles = {
    weatherContainer: {
      color: "white",
      fontFamily: "Sans-Serif",
      backgroundImage: `url(${weatherImage})`,
      height: "100%",
      minHeight: "100vh",
      width: "100vw",
    },
    innerWrapper: {
      height: "100%",
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "80px 30px 30px",
    },
    forecastWrapper: {
      marginBottom: "80px",
    },
    tableWrapper: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      padding: "30px",
      borderRadius: "10px",
    },
    table: {
      width: "100%",
    },
    tableHeader: {
      paddingBottom: "10px",
      marginBottom: "10px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    },
    toggleButtonGroup: {
      position: "absolute",
      top: "10px",
      right: "10px",
    },
  };

  return (
    <div style={styles.weatherContainer}>
      <ToggleButtonGroup name="radio" style={styles.toggleButtonGroup}>
        <ToggleButton
          name="radio"
          value="f"
          checked={tempUnit === "f"}
          variant={tempUnit === "f" ? "light" : "outline-light"}
          onClick={(e) => setTempUnit("f")}
        >
          &deg;F
        </ToggleButton>
        <ToggleButton
          name="radio"
          value="c"
          checked={tempUnit === "c"}
          variant={tempUnit === "c" ? "light" : "outline-light"}
          onClick={(e) => setTempUnit("c")}
        >
          &deg;C
        </ToggleButton>
      </ToggleButtonGroup>
      <Stack
        direction="vertical"
        className="justify-content-between"
        style={styles.innerWrapper}
      >
        <Form onSubmit={!isLoading ? handleSubmit : null}>
          <Stack
            direction="horizontal"
            gap={1}
            className="mx-auto justify-content-center mb-2"
          >
            <Form.Group
              controlId="weatherForm.address"
              style={{ width: "50%" }}
            >
              <Form.Control
                type="text"
                name="address"
                placeholder="Please enter a city and state or zipcode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="light" disabled={isLoading}>
              {isLoading ? "Loading…" : "Search"}
            </Button>
          </Stack>
        </Form>
        {forecasts && (
          <Container style={styles.forecastWrapper}>
            <Row>
              <Col>
                <TodayForecast
                  data={forecasts[0]}
                  tempUnit={tempUnit}
                ></TodayForecast>
              </Col>

              <Col style={styles.tableWrapper}>
                <h4 style={styles.tableHeader}>6-Day Forecast</h4>
                <div style={{ overflow: "auto" }}>
                  <table style={styles.table}>
                    <tbody>
                      {forecasts.map((forecast, index) => (
                        <Forecast
                          data={forecast}
                          tempUnit={tempUnit}
                          key={index}
                        ></Forecast>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </Stack>
    </div>
  );
};

export default WeatherComponent;
