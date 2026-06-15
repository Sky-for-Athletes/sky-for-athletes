export interface IUserPreferences {
  sports: Array<{
    name: string;
    temperatureMin: number;
    temperatureMax: number;
    humidityMax: number;
    windMax: number;
  }>;
}

export interface IUserProfile {
  _id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  lastLogin?: string;
}
