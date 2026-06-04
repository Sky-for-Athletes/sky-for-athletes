export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  email: string;
}

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface IRegisterResponse {
  token: string;
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
}
