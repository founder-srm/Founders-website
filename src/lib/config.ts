const currentEnvironment = (process.env.ENVIRONMENT || 'production') as
  | 'development'
  | 'production';

const config: {
  [key in 'development' | 'production']: {
    baseUrl?: string;
  };
} = {
  development: {
    baseUrl: 'http://localhost:3000',
  },
  production: {
    baseUrl: 'https://www.thefoundersclub.in',
  },
};

export default config[currentEnvironment];
