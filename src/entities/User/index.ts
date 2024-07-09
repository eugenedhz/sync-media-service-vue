import UserLabel from './ui/UserLabel/UserLabel.vue';
import UserLabelList from './ui/UserLabelList/UserLabelList.vue';

export { useFriendsApi, useGetUserApi } from './api/requests';

export type { User } from './model/types/user';
export { useUserStore } from './model/userStore';

export {
    UserLabel,
    UserLabelList
}