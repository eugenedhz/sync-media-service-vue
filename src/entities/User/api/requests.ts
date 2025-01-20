import { User, FriendsStatus } from '../model/types/user';

import { buildApi } from '@/shared/api/lib/useApi';

export const checkAuthNamespace = 'check';
export const logoutNamespace = 'logout';
export const getFriendsNamespace = 'getFriends';
export const getUserNamespace = 'getUser';
export const getCreatorNamespace = 'getCreator';
export const updateUserNamespace = 'updateUser';
export const getFriendsStatusNamespace = 'friendsStatus';
export const getFriendsRequestsNamespace = 'getFriendsRequests';
export const addFriendNamespace = 'addFriend';
export const deleteFriendNamespace = 'deleteFriend';
export const cancelFriendRequestNamespace = 'cancelFriendRequest';
export const rejectFriendRequestNamespace = 'rejectFriendRequest';

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

export const useGetUserApi = buildApi<User>(getUserNamespace, {
    url: '/user',
    method: 'GET',
    withCredentials: true
});

export const useGetCreatorApi = buildApi<User>(getCreatorNamespace, {
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

export const useFriendsApi = buildApi<User[]>(getFriendsNamespace, {
    url: '/friends',
    method: 'GET',
    withCredentials: true
});

export const useGetFriendsStatusApi = buildApi<FriendsStatus>(getFriendsStatusNamespace, {
    url: '/friends/status',
    method: 'GET',
    withCredentials: true
});

export const useGetFriendsRequestsApi = buildApi<User[]>(getFriendsRequestsNamespace, {
    url: '/friends/received',
    method: 'GET',
    withCredentials: true
});

export const useAddFriendApi = buildApi<User>(addFriendNamespace, {
    url: '/friends',
    method: 'POST',
    withCredentials: true
});

export const useDeleteFriendApi = buildApi<User>(deleteFriendNamespace, {
    url: '/friends',
    method: 'DELETE',
    withCredentials: true
});

export const useCancelFriendRequestApi = buildApi<User>(cancelFriendRequestNamespace, {
    url: '/friends/delete',
    method: 'DELETE',
    withCredentials: true
});

export const useRejectFriendRequestApi = buildApi<User>(rejectFriendRequestNamespace, {
    url: '/friends/reject',
    method: 'DELETE',
    withCredentials: true
});