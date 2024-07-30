"use client"

import { useState } from "react"
import { VerifyOfacSdnResponsePayload } from "@/app/api/verifyOfacSdn/route"

export default function OfacForm({ setMatch }: { setMatch: React.Dispatch<React.SetStateAction<VerifyOfacSdnResponsePayload[] | null>>}){
  const [formData, setFormData] = useState({
    fullName: "",
    birthYear: "",
    country: ""
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/verifyOfacSdn", {
      method: "POST",
      body: JSON.stringify(formData)
    })
    const data = await res.json();
    if (!res.ok) {
      // error with request; handle accordingly.
      setError(data.message)
    } else {
      
      setMatch(data)
    }
    setLoading(false)
  }

  return (
    <form
      className="flex flex-col justify-between h-full bg-gray-300 p-12 rounded-lg"
      onSubmit={handleFormSubmit}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <p>Full Name</p>
          <input
            className="p-2 mt-4 rounded-md"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                fullName: e.target.value
              }))
            }}
          />
        </div>
        <div className="flex flex-col">
          <p>Birth Year</p>
          <input
            required
            className="p-2 mt-4 rounded-md"
            placeholder="Birth Year"
            value={formData.birthYear}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                birthYear: e.target.value
              }))
            }}
          />
        </div>
        <div className="flex flex-col">
          <p>Country</p>
          <input
            required
            className="p-2 mt-4 rounded-md"
            placeholder="Country"
            value={formData.country}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                country: e.target.value
              }))
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-600">* {error}</p>}

      <button disabled={loading} type="submit" className="bg-white rounded-full px-8 py-3 mt-8 disabled:cursor-not-allowed">Submit</button>
    </form>
  )
}