import { User } from '../model/types/user';

import { buildApi } from '@/shared/api/lib/useApi';

export const checkAuthNamespace = 'check';
export const logoutNamespace = 'logout';
export const getFriendsNamespace = 'getFriends';
export const getUserNamespace = 'getUser';
export const updateUserNamespace = 'updateUser';

export const useCheckAuthApi = buildApi<User, void>(checkAuthNamespace, {
    url: '/auth/refresh',
    method: 'POST',
    withCredentials: true
});

export const useLogoutApi = buildApi<void>(logoutNamespace, {
    url: '/auth/logout',
    method: 'POST',
    withCredentials: true
});

export const useFriendsApi = buildApi<User[]>(getFriendsNamespace, {
    url: '/friends',
    method: 'GET',
    withCredentials: true
});

export const useGetUserApi = buildApi<User>(getUserNamespace, {
    url: '/user',
    method: 'GET',
    withCredentials: true
});

export const useUpdateUserApi = buildApi<User, FormData>(updateUserNamespace, {
    url: '/user',
    method: 'PATCH',
    withCredentials: true,
    headers: {'Content-Type': 'multipart/form-data'}
});