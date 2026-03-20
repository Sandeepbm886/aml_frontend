import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0a0d14] text-white' style={{
                    backgroundImage:
                        "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}>
        <SignIn forceRedirectUrl='/transaction'/>
    </div>
  )
}

export default page