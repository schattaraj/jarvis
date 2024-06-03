import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../components/header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Home() {
   const router = useRouter()
   useEffect(()=>{
      router.push("/login")
   },[])
  return (
   <></>
  );
}
