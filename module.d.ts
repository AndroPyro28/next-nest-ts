declare namespace NodeJs {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_ACCESSTOKEN_SECRET_KEY: string;
    JWT_REFRESHTOKEN_SECRET_KEY: string;
  }
}
