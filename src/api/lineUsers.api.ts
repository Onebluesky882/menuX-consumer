import { axiosInstance } from ".";

export const api = {
  getLineUserById: async (id: string) => {
    return await axiosInstance.get(`/auth/${id}`);
  },
};
