import { api } from './api';

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendWhatsapp: builder.mutation<{ success: boolean; message: string }, { phone: string; message: string }>({
      query: (body) => ({
        url: '/notifications/whatsapp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendWhatsappMutation,
} = notificationApi;
