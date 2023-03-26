const mongoose = require("mongoose");
exports.connectDB = (uri) => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log(`DB Connected`.yellow.bold);
    })
    .catch((err) => console.log(`Error DB connect --> ${err}`));
};
