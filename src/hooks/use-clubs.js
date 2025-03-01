import { useEffect, useState } from "react";
import useAxios from "./use-axios";

const CLUBS_URL = "/clubs";

const useClubs = ({ search, page }) => {
  const [clubs, setClubs] = useState([]);
  const [count, setCount] = useState(0);

  const axios = useAxios();

  useEffect(() => {
    const getClubs = async () => {
      const params = {
        page: page ?? 1,
      };
      if (!!search) params["query"] = search;
      try {
        const response = await axios.get(CLUBS_URL, { params });
        if (response.data) {
          debugger
          setClubs(response.data);
          setCount(response.data.length);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getClubs();
  }, [search, page]);
  return { clubs, count };
};

export default useClubs;
