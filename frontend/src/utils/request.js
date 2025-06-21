export const request = async (url, options = {}) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  return response;
};
