import React from 'react'
import {motion} from 'framer-motion'
const LoadMoreDataBtn = ({ state, fetchDataFun, addtionalParams }) => {
 
  
  if (state != null && state.totalDocs > state.results?.length) {
    return (
      <motion.button
        className="text-white p-2 px-3 rounded-md flex items items-center gap-2 btn-dark"
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          fetchDataFun({...addtionalParams , page: state.page + 1 });
        }}
      >
        LoadMore
      </motion.button>
    );
  }
};

export default LoadMoreDataBtn