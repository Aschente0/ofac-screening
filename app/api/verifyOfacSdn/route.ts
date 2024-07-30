import config from "@/config";
import Joi from "joi";
import { NextResponse } from "next/server";

import { ofacFormSchema } from "@/schemas/OfacForm";
import { ErrorCodes } from "@/utils/http-helpers";

// Partial type for OFAC screening response
interface OfacResponse {
  error: boolean,
  errorMessage: string,
  sources: {
      source: string,
      name: string,
      country: string,
      publishDate: string,
      downloadDate: string
  }[],
  results: {
    id: string,
    name: string,
    matchCount: number,
    matches: {
      matchSummary: {
        matchFields: {
          fieldName: string,
        }[]
      },
      sanction: {
        name: string,
        addresses: {
          country: string
        }[],
        personDetails: {
          birthDates: string[],
        }
      }
    }[]
  }[]
}

export interface VerifyOfacSdnRequestPayload {
  fullName: string;
  birthYear: string;
  country: string;
}

export interface VerifyOfacSdnResponsePayload {
  fullName: {
    value: string | null;
    match: boolean;
  }
  birthYear: {
    value: string | null;
    match: boolean;
  }
  country: {
    value: string | null;
    match: boolean;
  }
}

export async function POST(req: Request) {
  const formData: VerifyOfacSdnRequestPayload = await req.json();

  try {
    await ofacFormSchema.validateAsync(formData);
  }
  catch (err) { 
    const joiError = err as { details: {message: string}[]}
    return NextResponse.json({code: ErrorCodes.ERR_INVALID_REQUEST, message: joiError.details[0].message}, {status: 400})
  }

  const cases = [{
    name: formData.fullName,
    dob: `${formData.birthYear}-01-01`,
    address: {
      country: formData.country
    }
  }]

  try {
    const response = await fetch(
      `https://api.ofac-api.com/v4/screen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apiKey": config.OfacApiKey,
        },
        body: JSON.stringify({
          cases
        }),
      }
    );
    const data: OfacResponse = await response.json();

    const targetCase = data.results[0]

    // if no matches, return
    if (targetCase.matchCount === 0) {
      return NextResponse.json([], { status: 200 })
    }


    const result = targetCase.matches.map(match => {
      /*
        Name of sanctioned entity can be an alias; typically this relation is shown in the match summary.
        For instance, input name "John Henry" will trigger a match for "Damion Patrick John RYAN" on the
         name field, because "John Henry is one of the entity's alias."
        Therefore, assume we search for name match based on matches to any alias (i.e. matchSummary field)
      */
      const nameMatch = match.matchSummary.matchFields.some(matchField => matchField.fieldName === "Name")
      /*
        Once a match is found, the entity will have more detailed info such as country and birth date(s).
        Due to nature of the API response, determine matches based on the entity's matched details only.
        For matches on the primary entity (non-alias), we could always make another request.
      */
      const birthYearMatch = match.sanction.personDetails.birthDates.some(datestring => {
        // birthDates strings in form "dd mm yyyy"
        const year = datestring.split(" ")[2]
        return year === formData.birthYear
      })
      // naive country matching; can improve easily by using packages such as `https://www.npmjs.com/package/countries-list`
      // on the front-end to prevent user error, and on the back-end to validate if it is a valid country.
      const countryMatch = match.sanction.addresses.some(field => field.country === formData.country)
      return {
        fullName: {
          value: match.sanction.name,
          match: nameMatch
        },
        birthYear: {
          value: formData.birthYear,
          match: birthYearMatch
        },
        country: {
          value: formData.country,
          match: countryMatch
        }
      }
    })
    return NextResponse.json(result, { status: 200 });
  } catch (e: Error | any) {
    // trivial additional error handling of OFAC API required; e.g. invalid name, year, country.
    return NextResponse.json(
      { code: ErrorCodes.ERR_INTERVAL_SERVER, message: "An unknown error has occurred." },
      { status: 500 }
    );
  }
}
