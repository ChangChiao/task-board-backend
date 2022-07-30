const axios = require("axios");
const config = require("../config/config");

const uploadImgur = () => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("album", config.imgur.album_id);

  return axios({
    method: "POST",
    url: uploadApiUrl,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Client-ID ${config.imgur.client_id}`,
    },
    data: formData,
  });
};

module.exports = uploadImgur;

