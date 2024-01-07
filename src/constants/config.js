export const API_NOTIFICATION_MESSAGE = {
  loading: {
    title: "Loading...",
    message: "Data is being loaded, please wait",
  },
  success: {
    title: "Success",
    message: "Data successfully loaded",
  },
  responseFailure: {
    title: "Error",
    message:
      "An error occured while fetching response from the server. Please try again.",
  },
  requestFailure: {
    title: "Error",
    message: "An error occured while parsing the request data",
  },
  networkError: {
    title: "Error",
    message:
      "Unable to connect with the server. Please check the internet connectivity.",
  },
};

export const SERVICE_URLS = {
  userLogin: { url: "/auth", method: "POST" },
  getUsers: { url: "/user", method: "GET" },
  createUser: { url: "/user", method: "POST" },
  getS3URL: { url: "/PList", method: "POST" },
  updateMySQL: { url: "/PList/internal", method: "POST" },
  getPendingLists: { url: "/PList", method: "GET" },
  // createPost: { url: '/user', method: 'POST' },
};
