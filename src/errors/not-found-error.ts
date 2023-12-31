import { ApplicationError } from '@/protocols';

export function notFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'No result for this search!',
  };
}

export function notFoundErrorType2(message: string): ApplicationError {
  return {
    name: 'NotFoundError',
    message: message,
  };
}
