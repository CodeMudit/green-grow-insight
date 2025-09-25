const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000";

export async function postChatGeneral(prompt: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/chat/general`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error(`Chat error: ${res.status}`);
  const data = await res.json();
  return data.response as string;
}

export async function postVoiceChat(file: File) {
  const form = new FormData();
  form.append("audio", file);
  const res = await fetch(`${API_BASE_URL}/chat/voice_chat`, {
    method: "POST",
    body: form
  });
  if (!res.ok) throw new Error(`Voice chat error: ${res.status}`);
  return res.json();
}

export async function postAnalyzeImage(file: File, voice: boolean = true, lang: string = "hi") {
  const form = new FormData();
  form.append("file", file);
  const url = new URL(`${API_BASE_URL}/image-analysis/analyze`);
  url.searchParams.set("voice", String(voice));
  url.searchParams.set("lang", lang);
  const res = await fetch(url.toString(), {
    method: "POST",
    body: form
  });
  if (!res.ok) throw new Error(`Analyze error: ${res.status}`);
  return res.json();
}

export async function getWeather(location: string) {
  const res = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(location)}`);
  if (!res.ok) throw new Error(`Weather error: ${res.status}`);
  return res.json();
}

export async function getWeatherByCoords(lat: number, lon: number) {
  const res = await fetch(`${API_BASE_URL}/api/weather/coords?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error(`Weather coords error: ${res.status}`);
  return res.json();
}

// Map Open-Meteo weather codes to human-readable conditions
function mapWeatherCodeToText(code: number): string {
  const mapping: Record<number, string> = {
    0: "Sunny",
    1: "Mainly Sunny",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Foggy",
    48: "Rime Fog",
    51: "Light Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Snow",
    80: "Showers",
    95: "Thunderstorm",
  };
  return mapping[code] || "Unknown";
}


export async function detectLocationFromIP() {
  const res = await fetch(`${API_BASE_URL}/api/location/detect-ip`);
  if (!res.ok) throw new Error(`IP location detection error: ${res.status}`);
  return res.json();
}

export async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "cropDrop/1.0 (visheshgupta890@gmail.com)", // Nominatim requires identifying header
      "Accept": "application/json",
    },
  });

  console.log(res)

  if (!res.ok) {
    throw new Error(`Reverse geocoding error: ${res.status}`);
  }

  const data = await res.json();
  const address = data.address || {};

  return {
    city: address.city || address.town || address.village || address.municipality || null,
    district: address.county || address.state_district || address.district || address.suburb || null,
    state: address.state || address.province || null,
    country: address.country || null,
  };
  console.log(data.address)
}


export async function getCropNews(crop: string) {
  const res = await fetch(`${API_BASE_URL}/crop-news/${encodeURIComponent(crop)}`);
  if (!res.ok) throw new Error(`News error: ${res.status}`);
  return res.json();
}

export async function postMicroAdvice(params: { crop_type: string; growth_stage: string; state: string; lang?: string; }) {
  const res = await fetch(`${API_BASE_URL}/micro-calculator/get_advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, lang: params.lang || "en" })
  });
  if (!res.ok) throw new Error(`Advice error: ${res.status}`);
  return res.json();
}

export function getAssetUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Auth
export async function postRegister(payload: { name: string; phone: string; password: string; land_size: number; lat: number; lon: number; email?: string | null; }) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Register error: ${res.status}`);
  return res.json();
}

export async function postLogin(payload: { phone: string; password: string; }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Login error: ${res.status}`);
  return res.json();
}

export async function getUserProfile(phone: string) {
  const res = await fetch(`${API_BASE_URL}/auth/profile/${encodeURIComponent(phone)}`);
  if (!res.ok) throw new Error(`Profile error: ${res.status}`);
  return res.json();
}

export async function getDashboard(phone: string) {
  const res = await fetch(`${API_BASE_URL}/weather/dashboard/${encodeURIComponent(phone)}`);
  if (!res.ok) throw new Error(`Dashboard error: ${res.status}`);
  return res.json();
}

export async function getWeatherDashboard(phone: string) {
  const res = await fetch(`${API_BASE_URL}/weather/dashboard/${encodeURIComponent(phone)}`);
  if (!res.ok) throw new Error(`Weather dashboard error: ${res.status}`);
  return res.json();
}

// NPK Calculator API
export async function postNPKCalculation(params: {
  crop_type: string;
  growth_stage: string;
  state: string;
  land_size?: number;
  phone?: string;
  lang?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/micro-calculator/get-advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, lang: params.lang || "en" })
  });
  if (!res.ok) throw new Error(`NPK calculation error: ${res.status}`);
  return res.json();
}

// Location detection API
export async function getLocationFromIP() {
  try {
    const res = await fetch(`${API_BASE_URL}/micro-calculator/location/detect-ip`);
    if (!res.ok) throw new Error(`Location detection error: ${res.status}`);
    return res.json();
  } catch (error) {
    // Fallback to browser geolocation if API fails
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }
}

// Get state from coordinates
export async function getStateFromCoordinates(lat: number, lon: number) {
  const res = await fetch(`${API_BASE_URL}/micro-calculator/location/coordinates-to-state?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error(`State detection error: ${res.status}`);
  return res.json();
}



