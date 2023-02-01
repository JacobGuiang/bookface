import { isAxiosError } from 'axios';

export const logError = (error: unknown) => {
  if (isAxiosError(error) && error.response) {
    console.log(error.response.data.error);
  } else if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log(error);
  }
};
