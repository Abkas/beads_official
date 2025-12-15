import axiosInstance from "../axiosInstance";

const API_URL = "/offers";

export const getAllOffers = async () => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const getActiveOffers = async () => {
  const response = await axiosInstance.get(`${API_URL}/active`);
  return response.data;
};

export const getOfferById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

export const createOffer = async (offerData) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.post(API_URL, offerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateOffer = async (id, offerData) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.put(`${API_URL}/${id}`, offerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const toggleOfferActive = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.patch(`${API_URL}/${id}/toggle-active`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteOffer = async (id) => {
  const token = localStorage.getItem("token");
  await axiosInstance.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOfferProducts = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}/products`);
  return response.data;
};
