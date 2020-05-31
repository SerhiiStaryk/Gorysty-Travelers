import { Component, OnInit } from '@angular/core';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { WeatherService } from 'src/app/shared/services/weather.service';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  weatherImg: string;

  arrCity: Array<ICity> = [];
  arrWeather: Array<any> = [];
  test: any;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    this.getAllCity();
  }

  private getAllCity(): void {
    this.weatherService.getAllFirebaseCity().subscribe(
      data => {
        this.arrCity = data;
        this.setWeatherCity(this.arrCity);
      });
  }

  private setWeatherCity(city: Array<ICity>): void {
    let cityWeather: any;
    city.map(el => {
      this.weatherService.getWeatherData(el).subscribe(
        data => {
          cityWeather = data;
          // console.log(cityWeather);
          
          const unixTimestamp = cityWeather.current.dt;
          const arrDaily: Array<any> = [];
          const arr = cityWeather.daily;
          arr.map(day => {
            const unixTimestampDaily = day.dt;
            const dailyWeather = {
              date: new Date(unixTimestampDaily * 1000),
              temp: day.temp.eve,
              humidity: day.humidity,
              icon: day.weather[0].icon
            };
            arrDaily.push(dailyWeather);
          });
          const newWeather = {
            name: el.name,
            titleImg: el.titleImg,
            date: new Date(unixTimestamp * 1000),
            temp: cityWeather.current.temp,
            humidity: cityWeather.current.humidity,
            icon: cityWeather.current.weather[0].icon,
            daily: arrDaily.slice(1)
          };
          this.arrWeather.push(newWeather);
        });

    });
    // console.log(this.arrWeather);
  }

  public setIcoWeather(ico: string): string {
    return `https://openweathermap.org/img/wn/${ico}@2x.png`;
  }
}



