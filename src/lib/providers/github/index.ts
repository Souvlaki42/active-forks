import { Fork } from "../common";
import getForks from "./forks";
import * as schemas from "./schema";

const provider = {
  getForks,
  search: (query?: string[]): Promise<Fork[]> => {
    console.warn("Search is not implemented yet! Query:", query);
    return Promise.resolve([]);
  },
  schemas,
};

export default provider;
