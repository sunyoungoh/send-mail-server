const getToday = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = ('0' + (1 + date.getMonth())).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
};

const getThreedaysAgo = () => {
  let date = new Date();
  date.setDate(date.getDate() - 3);

  let year = date.getFullYear();
  let month = ('0' + (1 + date.getMonth())).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
};

const getSixdaysAgo = () => {
  let date = new Date();
  date.setDate(date.getDate() - 6);

  let year = date.getFullYear();
  let month = ('0' + (1 + date.getMonth())).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
};

export { getToday, getThreedaysAgo, getSixdaysAgo };

