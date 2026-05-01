"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import { SettingContext } from '@/context/SettingContext';
import { RefreshDataContext } from '@/context/RefreshDataContext';

const provider = ({children}:any) => {
 const [userDetail,setUserDetail] =useState();
 const[settingDetails,setSettingDetails]=useState();
const[refreshData,setRefreshData]=useState();

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
      <SettingContext.Provider value={{settingDetails,setSettingDetails}}>
        <RefreshDataContext.Provider value={{refreshData,setRefreshData}}>
          <div>{children}</div>
        </RefreshDataContext.Provider>
      </SettingContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default provider