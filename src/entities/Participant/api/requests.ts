import { buildApi } from "@/shared/api/lib/useApi";
import { Participant } from "../model/types/participant";

export const useGetAllParticipantsApi = buildApi<Participant[], void>('GetAllParticipants', {
    url: '/participants/all',
    method: 'GET',
});
