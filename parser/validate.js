const axios = require('axios');

(() => axios('https://www.youtube.com/get_video_info\?video_id\=Kw01XZLv5Vs')
  .then(resp => console.log(resp.data))
)();
