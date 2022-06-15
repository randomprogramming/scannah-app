import axios from "axios";

const fetcher = (url: string, campaignId: string) =>
  axios({
    url: url,
    method: "POST",
    data: {
      campaignId,
    },
  }).then((res) => res.data);
export default fetcher;
