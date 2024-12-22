import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
  user
}) => {
  let obj;
  let headers = {}

  //console.log(data);
  

  if(user){
    headers.headers = {
      Authorization : `Bearer ${user}`
    }
  }

  if (state !== null && !create_new_arr) {
    // Ensure state.results is an array before spreading
    const results = Array.isArray(state.results) ? state.results : [];
    obj = { ...state, results: [...results, ...data], page };
  } else {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send, headers)
      .then(({ data: { totalDocs } }) => {
        obj = { results: data, page: 1, totalDocs };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return obj;
};
