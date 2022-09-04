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
    JWT_EXPIRES_DAY: Joi.string().description("JWT expire days"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    GOOGLE_CLIENT_ID: Joi.string().description("clientId for google"),
    GOOGLE_CLIENT_SECRET: Joi.string().description("secret for google"),
    GOOGLE_REFRESH_TOKEN: Joi.string().description("token for google"),
    FACEBOOK_CLIENT_ID: Joi.string().description("clientId for fb"),
    FACEBOOK_CLIENT_SECRET: Joi.string().description("secret for fb"),
    HASHKEY: Joi.string().description("HASHKEY for newebpay"),
    HASHIV: Joi.string().description("HASHIV for newebpay"),
    MERCHANTID: Joi.string().description("merchantID for newebpay"),
    VERSION: Joi.number().description("version for newebpay"),
    LINE_PAY_CHANNELID: Joi.number().description("channelID for linePay"),
    LINE_PAY_SECRET: Joi.string().description("secretKey for linePay"),
    CALLBACK_URL: Joi.string().description("callbackurl for oauth"),
    FRONTEND_URL: Joi.string().description("website url"),
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
  imgur: {
    client_id: envVars.IMGUR_CLIENTID,
    client_secret: envVars.IMGUR_CLIENT_SECRET,
    refresh_token: envVars.IMGUR_REFRESH_TOKEN,
    album_id: envVars.IMGUR_ALBUM_ID,
  },
  email: {
    smtp: {
      user: envVars.SMTP_USERNAME,
    },
    from: envVars.EMAIL_FROM,
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    refreshToken: envVars.GOOGLE_REFRESH_TOKEN,
  },
  fb: {
    clientId: envVars.FACEBOOK_CLIENT_ID,
    clientSecret: envVars.FACEBOOK_CLIENT_SECRET,
  },
  newebpay: {
    hashkey: envVars.HASHKEY,
    hashiv: envVars.HASHIV,
    merchantID: envVars.MERCHANTID,
    version: envVars.VERSION
  },
  linepay:{
    channelID: envVars.LINE_PAY_CHANNELID,
    secretKey: envVars.LINE_PAY_SECRET,
  },
  callback: envVars.CALLBACK_URL,
  frontEnd: envVars.FRONTEND_URL,
};
