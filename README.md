# Nodejs complete guide

### Run app
  1. Clone this repository
  2. Install packages `npm install`
  3. Run app `npm start`

---
## Additional configuration
### Mongodb
To connect to the mongo database, it is necessary to set the url to the database in the environment variable `MONGODB_URL`.

### Send mail
If you want to enable the sending of emails when the user registers, it is necessary to set the `SENDGRID` environment variable with the value of the your **api-key**.


---
## nodemon.json configuration
In **development** it is necessary to have the following configuration in the **nodemon.json** file:
```json
{
  "env": {
    "SENDGRID_KEY": "API_KEY_VALUE",
    "MONGODB_URL": "URL_MONGO_DB"
  }
}
```