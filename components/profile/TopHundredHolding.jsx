import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const TopHundredHolding = () => {
  const baseUrl = process.env.NEXT_PUBLIC_MOONPRO_BASE_URL
  const solWalletAddress = useSelector(
    (state) => state?.AllStatesData?.solWalletAddress
  ); 
  async function getData() {
    const auth = localStorage.getItem("token")
    if (!auth) return
    await axios.get(`${baseUrl}transactions/PNLSolanaHistory/${solWalletAddress}`, {
      headers: {
        Authorization: `Bearer ${auth}`,
      }
    })
      .then((response) => {
        console.log("response", response)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <div>TopHundredHolding</div>
  )
}

export default TopHundredHolding