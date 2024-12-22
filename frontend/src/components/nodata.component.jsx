import React from 'react'

const NOData = ({message="No data to show"}) => {
  return (
    <div className='text-center w-full p-4 rounded-full bg-grey/50 mt-4'>
      <p>{message}</p>
    </div>
  )
}

export default NOData