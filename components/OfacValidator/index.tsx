"use client"

import { useState } from "react"
import OfacForm from "./OfacForm"
import OfacIndicator from "./OfacIndicator"
import { VerifyOfacSdnResponsePayload } from "@/app/api/verifyOfacSdn/route"

export default function OfacValidator(){

  const [matches, setMatches] = useState<VerifyOfacSdnResponsePayload[] | null>(null)

  return (
    <div
      className="w-full h-[70vh] grid grid-cols-2 grid-flow-col gap-12"
    >
      <OfacForm setMatch={setMatches}/>
      <OfacIndicator matches={matches} />
    </div>
  )
}