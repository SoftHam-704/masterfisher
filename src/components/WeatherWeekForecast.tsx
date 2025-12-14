import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Wind, Droplets, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DayForecast {
  date: Date;
  temperature: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

const WeatherWeekForecast = () => {
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchWeekForecast = async () => {
      setLoading(true);
      try {
        // Default location: São Paulo
        const latitude = -23.5505;
        const longitude = -46.6333;
        
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 6); // Next 7 days
        
        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max&timezone=America/Sao_Paulo&start_date=${startDateStr}&end_date=${endDateStr}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.daily) {
          const weekForecasts: DayForecast[] = data.daily.time.map((dateStr: string, index: number) => ({
            date: new Date(dateStr + 'T00:00:00'),
            temperature: Math.round((data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2),
            precipitation: data.daily.precipitation_sum[index] || 0,
            windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
            humidity: data.daily.relative_humidity_2m_max[index] || 0,
          }));
          setForecasts(weekForecasts);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekForecast();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {forecasts.slice(0, 4).map((forecast, index) => (
        <Card key={index} className="hover:shadow-ocean transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              {forecast.date.toLocaleDateString(language === 'pt-BR' ? 'pt-BR' : 'en-US', { 
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('common.temperature')}</span>
              </div>
              <span className="font-semibold">{forecast.temperature}°C</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">{t('common.rain')}</span>
              </div>
              <span className="font-semibold">{forecast.precipitation}mm</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">{t('common.wind')}</span>
              </div>
              <span className="font-semibold">{forecast.windSpeed}km/h</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-secondary" />
                <span className="text-sm text-muted-foreground">{t('common.humidity')}</span>
              </div>
              <span className="font-semibold">{forecast.humidity}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeatherWeekForecast;
