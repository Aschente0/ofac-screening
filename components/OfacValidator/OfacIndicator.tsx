"use client"

import { VerifyOfacSdnResponsePayload } from "@/app/api/verifyOfacSdn/route";

export default function OfacIndicator({matches}:  {matches: VerifyOfacSdnResponsePayload[] | null}){
  return (
    <div className="flex flex-col gap-8 bg-gray-300 p-12 rounded-lg overflow-y-scroll">
      {matches ? 
        <div>
          <p className="text-4xl">{matches.length > 0 ? "Hit" : "Clear"}</p>
          <p className="mt-4">{matches.length > 0 ? "Based on the input data, the following entities may be related:" : "No matches based on input."}</p>
        </div> :
        <p>Submit form to query against OFAC SDN list</p> }
        {matches && matches.map((match, idx) => {
          return (
            <div
              key={`OfacMatch${idx}`}
              className="bg-white p-2 rounded-lg"
            >
              <p>Full Name: {match.fullName.value} {match.fullName.match ? "✅" : "❌"}</p>
              <p>Birth Year: {match.birthYear.value} {match.birthYear.match ? "✅" : "❌"}</p>
              <p>Country: {match.country.value} {match.country.match ? "✅" : "❌"}</p>
            </div>
          )
         })
        }
    </div>
  )
}