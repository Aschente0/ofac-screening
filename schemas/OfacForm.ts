import Joi from "joi";

export const ofacFormSchema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    birthYear: Joi.string().pattern(/^(19|20)\d{2}$/).required().label("Birth Year").messages({
      "string.pattern.base": "Year must be between 1900-2099"
    }),
    country: Joi.string().required().label("Country")
})