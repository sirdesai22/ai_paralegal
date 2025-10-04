//data that is to be stored
// user data
// user tasks
// calender events
export const storeDataToLocalStorage = (data: Record<string, any>) => {
  try {
    Object.entries(data).forEach(([key, value]) => {
      const jsonData = JSON.stringify(value);
      localStorage.setItem(key, jsonData);
    });
  } catch (error) {
    console.error(`Error storing data into local storage: ${error}`);
  }
};

export const getDataFromLocalStorage = (key: string) => {
  try {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error(`Error retrieving data from local storage: ${error}`);
    return null;
  }
};