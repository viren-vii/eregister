export const getDate = () => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  const newdate = day + "-" + month + "-" + year;
  return newdate;
};

export const getDateTime = () => {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getFullYear() +
    " at " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime;
};
