"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';

const provider = ({children}:any) => {
 const [userDetail,setUserDetail] =useState();
    useEffect(()=>{
        CreateNewUsers();
    },[])
    
    const CreateNewUsers=async ()=>{
        const result =await axios.post('/api/user',{});
        console.log(result.data)
        setUserDetail(result?.data);
    }
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  )
}

export default provider