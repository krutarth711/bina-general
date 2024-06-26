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
  deleteUser: { url: "/user", method: "DELETE" },
  getS3URL: { url: "/PList", method: "POST" },
  updateMySQL: { url: "/PList/internal", method: "POST" },
  generateInvoice: { url: "/PList/submit", method: "POST" },
  getPendingLists: { url: "/PList", method: "GET" },
  updatePendingList: { url: "/PList", method: "PUT" },
  getActivePendingLists: { url: "/PList", method: "GET", params: true },
  getActiveListItems: { url: "/active-lists", method: "GET", params: true },
  createActiveList: { url: "/active-lists", method: "POST" },
  updateActiveList: { url: "/active-lists", method: "PUT" },
  deleteActiveList: { url: "/active-lists", method: "DELETE", params: true },
};
