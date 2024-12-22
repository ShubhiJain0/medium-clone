import React from 'react'

const Input = ({type,placeholder , id, value, icon, name, className=""}) => {
  return (
    <div className="relative w-[100% mb-4] flex justify-center">
      <input
        name={name}
        type={type}
        id={id}
        defaultValue={value}
        placeholder={placeholder}
        className={`py-4 px-2 border border-gray-400 w-full pl-12 ${className}`}
      />
      <div className="absolute left-1 top-3 w-14 h-14">{icon}</div>
    </div>
  );
}

export default Input