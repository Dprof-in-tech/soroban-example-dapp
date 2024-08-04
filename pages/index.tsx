import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa'
import * as StellarSdk from '@stellar/stellar-sdk'
import CryptoJS from 'crypto-js'

const Index: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [secretKey, setSecretKey] = useState<string | null>(null)
  const [pincode, setPincode] = useState<string>('')

  useEffect(() => {
    if (status !== 'loading' && session) {
      generateKeyPair()
    }
  }, [session, status])

  const generateKeyPair = () => {
    const pair = StellarSdk.Keypair.random()
    setPublicKey(pair.publicKey())
    setSecretKey(pair.secret())
  }

  const encryptSecretKey = (key: string, pincode: string) => {
    return CryptoJS.AES.encrypt(key, pincode).toString()
  }

  const handlePincodeSubmit = () => {
    if (secretKey) {
      const encryptedSecretKey = encryptSecretKey(secretKey, pincode)
      localStorage.setItem('encryptedSecretKey', encryptedSecretKey)
      alert('Key pair generated and secret key encrypted and stored locally.')
      router.push('/home')
    }
  }

  return (
    <>
      <Head>
        <title>Soroban Social Login</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.login}>
          <button onClick={() => signIn('google')}><FaGoogle /> Sign in with Google</button>
          <button onClick={() => signIn('twitter')}><FaTwitter /> Sign in with Twitter</button>
          <button onClick={() => signIn('github')}><FaGithub /> Sign in with GitHub</button>
        </div>
        {publicKey && secretKey && (
          <div className={styles.keyPair}>
            <h3>Your Key Pair</h3>
            <p>Public Key: {publicKey}</p>
            <p>Secret Key: {secretKey}</p>
            <div>
              <input
                type="password"
                placeholder="Enter pincode to encrypt your secret key"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button onClick={handlePincodeSubmit}>Submit Pincode</button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Index
