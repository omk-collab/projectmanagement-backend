export function getErrorMessage(err) {
  // Backend ne specific message bheja hai
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  // Server tak pahunch hi nahi paya (server so raha hai ya net down)
  if (err.request) {
    return "Server is waking up, please try again in a few seconds.";
  }
  return "Something went wrong. Please try again.";
}
