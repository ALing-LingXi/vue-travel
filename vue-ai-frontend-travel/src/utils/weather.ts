import itheimaApi from './itheima-api'

// 城市信息类型
export interface CityInfo {
  code: string
  name: string
}

// 今日天气类型
export interface TodayWeather {
  humidity: string
  sunriseTime: string
  sunsetTime: string
  ultraviolet: string
  weather: string
  temDay: string
  temNight: string
}

// 天气预报类型
export interface DayForecast {
  date: string
  temDay: string
  weather: string
  temNight: string
  windPower: string
  windDirection: string
  dateFormat?: string
  weatherImg?: string
}

// 天气数据类型
export interface WeatherData {
  date: string
  area: string
  dateShort: string
  dateLunar: string
  temperature: string
  weather: string
  weatherImg: string
  windPower: string
  windDirection: string
  psPm25: string
  psPm25Level: string
  todayWeather: TodayWeather
  dayForecast: DayForecast[]
}

/**
 * 搜索城市
 * @param keyword 城市关键字
 */
export async function searchCity(keyword: string): Promise<CityInfo[]> {
  const result = await itheimaApi.get('/api/weather/city', {
    params: { city: keyword }
  }) as any
  return result
}

/**
 * 获取天气预报
 * @param cityCode 城市编码
 */
export async function getWeather(cityCode: string): Promise<WeatherData> {
  const result = await itheimaApi.get('/api/weather', {
    params: { city: cityCode }
  }) as any
  return result
}
