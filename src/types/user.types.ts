export interface IUser {
  _id: string,
  email: string,
  name: string,
  password: string,
  mobile: string,
  createdAt?: Date,
  updatedAt?: Date,
  
}

export interface RegisterBody {
  email: string,
  name: string,
  password: string,
  mobile: string,
}

export interface LoginBody {
  email: string,
  password: string,
}

export interface JWTPayload {
  userId: string,
  email?: string,
 
}
