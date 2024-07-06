import { User } from '@/entities/User';
import { buildApi } from '@/shared/api/lib/useApi';

import { useUserStore } from '@/entities/User';

export const updateAvatarNamespace = 'updateAvatar';
export const updateUsernameNamespace = 'updateUsername';
export const updateDisplayNameNamespace = 'updateDisplayName';
export const updateDescriptionNamespace = 'updateDescription';
export const updatePasswordNamespace = 'updatePassword';
export const deleteAccountNamespace = 'deleteAccount';

export interface UpdateAvatarRequestArgs {
    avatar: File;
}

export interface UpdateUsernameRequestArgs {
    username: string;
}

export interface UpdateDisplayNameRequestArgs {
    displayName: string;
}

export interface UpdateDescriptionRequestArgs {
    description: string;
}

export interface UpdatePasswordRequestArgs {
    password: string;
}

export const useUpdateAvatarApi = buildApi<User, UpdateAvatarRequestArgs>(
    updateAvatarNamespace,
    {
        url: '/user',
        method: 'PATCH',
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
);

export const useUpdateUsernameApi = buildApi<User, UpdateUsernameRequestArgs>(
    updateUsernameNamespace,
    {
        url: '/user',
        method: 'PATCH',
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
);

export const useUpdateDisplayNameApi = buildApi<
    User,
    UpdateDisplayNameRequestArgs
>(updateDisplayNameNamespace, {
    url: '/user',
    method: 'PATCH',
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const useUpdateDescriptionApi = buildApi<
    User,
    UpdateDescriptionRequestArgs
>(updateDescriptionNamespace, {
    url: '/user',
    method: 'PATCH',
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const useUpdatePasswordApi = buildApi<User, UpdatePasswordRequestArgs>(
    updatePasswordNamespace,
    {
        url: '/user',
        method: 'PATCH',
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
);

export const useDeleteAccountApi = buildApi<User, void>(
    deleteAccountNamespace,
    {
        url: '/user',
        method: 'DELETE',
        withCredentials: true,
        params: {
            id: Number(useUserStore().authData?.id)
        }
    }
);
