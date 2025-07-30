import { AxiosInstance } from 'axios';
import { makeGongRequest } from './gongClient';
import {
  CallsResponse,
  CallTranscriptsResponse,
  CallsExtensiveResponse,
  User,
  UsersResponse
} from '../schemas/gong';

export const listCalls = async (
  client: AxiosInstance,
  fromDateTime: string,
  toDateTime: string,
  cursor?: string
): Promise<CallsResponse> => {
  const params = new URLSearchParams({
    fromDateTime,
    toDateTime,
    ...(cursor && { cursor })
  });

  return makeGongRequest<CallsResponse>(
    client,
    'get',
    `/calls?${params.toString()}`
  );
};

export const getCallTranscripts = async (
  client: AxiosInstance,
  callIds: string[]
): Promise<CallTranscriptsResponse> => {
  return makeGongRequest<CallTranscriptsResponse>(
    client,
    'post',
    '/calls/transcript',
    {
      filter: { callIds }
    }
  );
};

export const getCallsExtensive = async (
  client: AxiosInstance,
  fromDateTime: string,
  toDateTime: string,
  primaryUserIds?: string[],
  cursor?: string
): Promise<CallsExtensiveResponse> => {
  return makeGongRequest<CallsExtensiveResponse>(
    client,
    'post',
    '/calls/extensive',
    {
      filter: {
        fromDateTime,
        toDateTime,
        ...(primaryUserIds && { primaryUserIds })
      },
      ...(cursor && { cursor }),
      contentSelector: {
        exposedFields: {
          parties: true
        }
      }
    }
  );
};

export const listUsers = async (
  client: AxiosInstance,
  cursor?: string
): Promise<UsersResponse> => {
  const params = cursor ? `?cursor=${cursor}` : '';

  return makeGongRequest<UsersResponse>(
    client,
    'get',
    `/users${params}`
  );
};

export const getAllUsers = async (
  client: AxiosInstance
): Promise<User[]> => {
  const allUsers: User[] = [];
  let cursor: string | undefined;

  do {
    const response = await listUsers(client, cursor);
    allUsers.push(...response.users);
    cursor = response.records.cursor;
  } while (cursor);

  return allUsers;
};

export const findUserByEmail = async (
  client: AxiosInstance,
  email: string
): Promise<User | undefined> => {
  const users = await getAllUsers(client);
  return users.find(user =>
    user.emailAddress?.toLowerCase() === email.toLowerCase()
  );
};