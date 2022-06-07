const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    IMGUR_CLIENTID: Joi.string().description("clientId for imgur"),
    IMGUR_CLIENT_SECRET: Joi.string().description("secret for imgur"),
    IMGUR_REFRESH_TOKEN: Joi.string().description("refresh token for imgur"),
    IMGUR_ALBUM_ID: Joi.string().description("album for imgur"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_EXPIRES_DAY: Joi.number().default(3).description("JWT expire days"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    GOOGLE_CLIENT_ID: Joi.string().description("clientId for google"),
    GOOGLE_CLIENT_SECRET: Joi.string().description("secret for google"),
    GOOGLE_REFRESH_TOKEN: Joi.string().description("token for google"),
    FACEBOOK_CLIENT_ID: Joi.string().description("clientId for fb"),
    FACEBOOK_CLIENT_SECRET: Joi.string().description("secret for fb"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expires: envVars.JWT_EXPIRES_DAY,
  },
  imgur:{
    client_id: envVars.IMGUR_CLIENTID,
    client_secret: envVars.IMGUR_CLIENT_SECRET,
    refresh_token: envVars.IMGUR_REFRESH_TOKEN,
    album_id: envVars.IMGUR_ALBUM_ID,
  },
  email: {
    smtp: {
      user: envVars.SMTP_USERNAME,
      pass: envVars.SMTP_PASSWORD,
    },
  },
  google: {
    client_id: envVars.GOOGLE_CLIENT_ID,
    client_secret: envVars.GOOGLE_CLIENT_SECRET,
    refresh_token: envVars.GOOGLE_REFRESH_TOKEN,
  },
  fb: {
    client_id: envVars.FACEBOOK_CLIENT_ID,
    client_secret: envVars.FACEBOOK_CLIENT_SECRET,
  },
};
