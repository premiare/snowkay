import { Text, Autocomplete, Container, Button, Loader, Group, Table, Radio } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const GEO_API_KEY = '690db74ec4msh19b558a8991aa01p1f26b0jsnd577ae7de1e7';
const GEO_API_HOST = 'wft-geo-db.p.rapidapi.com';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast?';
const WEATHER_API_CNT = 4;
const WEATHER_API_KEY = 'dd396371215b35841c325f238f603e55';

type SearchResults = SearchResultMapped[];

type SearchResultMapped = {
  label: string;
  value: string;
};

type SearchResultResponse = {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
};

export const Landing = () => {
  const timeoutRef = useRef<number>(-1);
  const [searchValue, setSearchValue] = useState('');
  const [debounced] = useDebouncedValue(searchValue, 500);
  const [temperatureValue, setTemperatureValue] = useState('celsius');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsMap, setSearchResultsMap] = useState<SearchResults>([]);
  const [selectedCity, setSelectedCity] = useState<SearchResultResponse>();
  const [selectedCityWeatherData, setSelectedCityWeatherData] = useState<any>();

  useEffect(() => {
    console.log(searchResultsMap);
  }, [searchResultsMap]);

  const handleGeoSearch = (value: string) => {
    console.log('handleGeoSearch', value);
    axios
      .get(`${GEO_API_URL}/cities`, {
        params: {
          namePrefix: value,
          limit: 10,
        },
        headers: {
          'x-rapidapi-key': GEO_API_KEY,
          'x-rapidapi-host': GEO_API_HOST,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setSearchResults(response.data.data);
        setSearchResultsMap(
          response.data.data.map((item: SearchResultResponse) => ({
            label: item.name,
            value: item.name,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eslint-disable-next-line consistent-return
  const getSelectedCityWeather = () => {
    if (selectedCity) {
      axios
        .get(
          `${WEATHER_API_URL}lat=${selectedCity?.latitude}&lon=${
            selectedCity?.longitude
          }&appid=${WEATHER_API_KEY}&cnt=${WEATHER_API_CNT}&units=${
            temperatureValue === 'celsius' ? 'metric' : 'imperial'
          }`
        )
        .then((response) => {
          console.log(response.data);
          setSelectedCityWeatherData(response.data.list);
          console.log(response.data.list);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return null;
    }
  };

  const findSelectedCity = (value: string) => {
    const getSelectedCity = searchResults.find((item: SearchResultResponse) => item.name === value);
    getSelectedCityWeather();
    setSelectedCity(getSelectedCity);
  };

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTemperatureValue(event);
    if (searchValue.length >= 3) {
      handleGeoSearch(searchValue);
      findSelectedCity(searchValue);
      getSelectedCityWeather;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setSearchResults([]);
    if (debounced.length <= 2) {
      setSearchLoading(false);
      setSearchResults([]);
    } else {
      setSearchLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setSearchLoading(false);
        handleGeoSearch(debounced);
        findSelectedCity(debounced);
        getSelectedCityWeather;
      }, 1000);
    }
  };

  return (
    <Container>
      <ColorSchemeToggle />

      <Text size="xl" weight={500}>
        snowkay
      </Text>
      <Container size="sm">
        <Radio.Group label="Choose your temperate measurement" onChange={handleTemperatureChange}>
          <Radio value="celsius" label="Celsius" defaultChecked />
          <Radio value="fahrenheit" label="Fahrenheit" />
        </Radio.Group>
        <Autocomplete
          label="search for a city of mountain"
          placeholder="search"
          data={searchResultsMap || []}
          onChange={handleSearchChange}
          rightSection={searchLoading ? <Loader size={16} /> : null}
        />
      </Container>
      <Container size="md">
        <Group position="center">
          {selectedCityWeatherData && (
            <Table striped>
              <thead>
                <tr>
                  <th> </th>
                  {selectedCityWeatherData &&
                    selectedCityWeatherData.map((item: any) => (
                      <th>{dayjs(item.dt_txt).format('DD/M/YYYY H:mm')}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weather</td>
                  {selectedCityWeatherData &&
                    selectedCityWeatherData.map((item: any) => (
                      <td>
                        {item.weather[0].main}
                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                          width="30"
                        />
                      </td>
                    ))}
                </tr>
                <tr>
                  <td>Feels Like</td>
                  {selectedCityWeatherData &&
                    selectedCityWeatherData.map((item: any) => (
                      <td>{Math.floor(item.main.feels_like)}</td>
                    ))}
                </tr>
                <tr>
                  <td>Temp</td>
                  {selectedCityWeatherData &&
                    selectedCityWeatherData.map((item: any) => (
                      <td>{Math.floor(item.main.temp)}</td>
                    ))}
                </tr>
                <tr>
                  <td>Max. Temp</td>
                  {selectedCityWeatherData &&
                    selectedCityWeatherData.map((item: any) => (
                      <td>{Math.floor(item.main.temp_max)}</td>
                    ))}
                </tr>
                <tr>
                  <td>Min. Temp</td>
                  {selectedCityWeatherData &&
                    selectedCityWeatherData.map((item: any) => (
                      <td>{Math.floor(item.main.temp_min)}</td>
                    ))}
                </tr>
              </tbody>
            </Table>
          )}
        </Group>
      </Container>
    </Container>
  );
};
