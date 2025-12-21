import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';
import axios from 'axios';
import { Alert } from 'react-native';
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  //   const [userName, setUserName] = useState(null);
  //   const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const loadUser = async () => {
  //       try {
  //         const storedName = await AsyncStorage.getItem('userName');
  //         if (storedName) {
  //           setUserName(storedName);
  //           setIsVerified(true);
  //         }
  //       } catch (e) {
  //         console.log('AsyncStorage error', e);
  //       }
  //       setLoading(false);
  //     };

  //     loadUser();
  //   }, []);

  const verifyUser = async name => {
    // await AsyncStorage.setItem('userName', name);
    try {
      const res = await axios.post(API.VERIFY_USER(), { name });
      console.log('res: ', res);
      if (res.data.success) {
        // setUserName(name);
        setIsVerified(true);
        return true
      } else {
        Alert.alert('Verification Failed:', res.data.message || 'Unknown error');
      }
    } catch (e) {
      console.log('verifyUser error:', e.message);
    }
  };

  const skipVerify = () => {
    setIsVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isVerified,
        // userName,
        // loading,
        verifyUser,
        skipVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
