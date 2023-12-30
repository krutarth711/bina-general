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
  userLogin: { url: "/auth/login", method: "POST" },
  // createPost: { url: '/create', method: 'POST' },
};
