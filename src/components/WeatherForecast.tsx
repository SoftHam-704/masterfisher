import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Wind, Droplets } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeatherForecastProps {
  date: Date;
  latitude?: number;
  longitude?: number;
}

interface WeatherData {
  temperature: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

const WeatherForecast = ({ 
  date, 
  latitude = -23.5505, // Default: São Paulo
  longitude = -46.6333 
}: WeatherForecastProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const dateStr = date.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate days difference
        const diffTime = new Date(dateStr).getTime() - new Date(today).getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Open-Meteo API (free, no key required)
        // For dates within 7 days, use forecast API
        // For historical data, use historical API
        const apiUrl = diffDays >= 0 && diffDays <= 7
          ? `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max&timezone=America/Sao_Paulo&start_date=${dateStr}&end_date=${dateStr}`
          : null;

        if (!apiUrl) {
          // For dates beyond 7 days, show a message
          setWeather(null);
          setLoading(false);
          return;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.daily) {
          setWeather({
            temperature: Math.round((data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2),
            precipitation: data.daily.precipitation_sum[0] || 0,
            windSpeed: Math.round(data.daily.wind_speed_10m_max[0]),
            humidity: data.daily.relative_humidity_2m_max[0] || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [date, latitude, longitude]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            {t('common.weatherForecast')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('common.loading')}...</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            {t('common.weatherForecast')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {t('common.language') === 'pt-BR' 
              ? 'Previsão disponível apenas para os próximos 7 dias.'
              : 'Forecast available only for the next 7 days.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          {t('common.weatherForecast')}
        </CardTitle>
        <CardDescription>
          {date.toLocaleDateString(t('common.language') === 'pt-BR' ? 'pt-BR' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('common.temperature')}</p>
              <p className="text-lg font-semibold">{weather.temperature}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">{t('common.rain')}</p>
              <p className="text-lg font-semibold">{weather.precipitation}mm</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">{t('common.wind')}</p>
              <p className="text-lg font-semibold">{weather.windSpeed}km/h</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('common.humidity')}</p>
              <p className="text-lg font-semibold">{weather.humidity}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
