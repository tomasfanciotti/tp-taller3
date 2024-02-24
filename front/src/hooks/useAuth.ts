import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { Session, User } from "../types/auth";


const authQueryKey = 'auth';

const parseToken = (token: string): any | undefined => {
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    return undefined;
  }
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}
export const createMutation = <TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  invalidateAll?: boolean,
  invalidateQueries: Array<string> = [],
) => () => {
  const queryClient = useQueryClient();
  return useMutation<TData, unknown, TVariables>(mutationFn, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(authQueryKey);
      if (invalidateAll) {
        queryClient.clear();
      } else {
        const proms = invalidateQueries.map((query) => queryClient.invalidateQueries(query));
        await Promise.all(proms);
      }
    },
  });
};

export const useAuthSession = () => {
  const {
    data,
    ...query
  } = useQuery<unknown, unknown, { user?: User, session: Session }>(authQueryKey, async () => {
    const item = localStorage.getItem('TOKEN_USER');
    if (!item) {
      return {
        session: { isLoggedIn: false }
      }
    }
    const user = parseToken(item);
    const dataFromUser = await fetch(`https://api.lnt.digital/users/${user.user_id}`, { headers: {authorization: `Bearer ${item}`} });
    const { data } = await dataFromUser.json();
    const userData: User = {
      id: user.user_id,
      email: user.email,
      name: data.fullname,
      telegramNumber: user.telegram_id,
      isDoctor: !!data.registration_number,
    }
    return { user: userData, session: { isLoggedIn: !!user } };
  });
  return {
    ...query,
    isAuthenticated: !!(data?.session.isLoggedIn),
    user: data?.user,
  }
}

export const useSignIn = createMutation(
  async (user: { mail: string; password: string }) => {
    let result;
    try {
      const urlParams = new URLSearchParams();
      urlParams.append('username', user.mail);
      urlParams.append('password', user.password);
      result = await fetch('https://api.lnt.digital/users/login', { body: urlParams, method: 'POST' });
      if (result.status > 300) {
        throw new Error('nup');
      }
      const data = await result.json()
      localStorage.setItem('TOKEN_USER', data.access_token);
    } catch (e) {
      throw new Error('Usuario o contraseña incorrecta');
    }
    return result;
  },
);

export interface signUpData {
  mail: string;
  password: string,
  phoneNumber: number,
  telegramId?: number,
  name: string,
  registrationNumber?: number
}

export const useSignUp = createMutation(
  async (user: { mail: string; password: string, phoneNumber: number, telegramId?: number, name: string, registrationNumber?: number }) => {
    let result;
    try {
      const body: Record<string, any> = {
        fullname: user.name,
        email: user.mail,
        city: "string",
        phoneNumber: user.phoneNumber,
        birthday: "string",
        password: user.password,
      };
      if (user.telegramId) body['telegram_id'] = user.telegramId;
      if (user.registrationNumber) body['registration_number'] = user.registrationNumber;
      result = await fetch('https://api.lnt.digital/users/', { body: JSON.stringify(body), method: 'POST', headers: { 'Content-Type': 'application/json'} });
      if (result.status > 300) {
        throw new Error('nup');
      }
      const data = await result.json()
      localStorage.setItem('TOKEN_USER', data.access_token);
    } catch (e) {
      throw new Error('Usuario o contraseña incorrecta');
    }
    return result;
  },
);
