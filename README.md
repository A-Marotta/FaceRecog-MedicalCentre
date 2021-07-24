# Doctors Clinic - Medclerk admin platform 
#### With a touch of AI by a python script running on an IoT device as a means for face recognition upon patient arrival to clinic.
![Alt text](/design_doc/UI-sample.png)

### Deployment 

This website is deployed on [Heroku](https://tranquil-springs-32742.herokuapp.com/)
<br/>
<br/>
Test medclerk account: (login and admin functionality)<br/>
Login: john.medclerk@gmail.com <br/>
Password: 123456 <br/>
<br/>
Test doctor account (creating availability in the database & google cal integration): <br/>
Login: rsanchez.medcentre@gmail.com <br/>
Password: not required as the medclerk user account handles the admin operation <br/>
<br/>
Test patient account (booking appointments): <br/>
Login: j.doe@gmail.com <br/>
Password: not required as the medclerk user account handles the admin operation <br/>
<br/>

### Tech stack

**M** - Mongodb <br/>
**E** - Express <br/>
**R** - React <br/>
**N** - Nodejs <br/>
<br/>

### Integrations / Cool technologies

  - OpenCV (face recognition with Python)
  - Google Calendar API
  - Uppy & multer (file upload to server to use for face recognition)
  - Nodemailer (automatic email upon patient arrival)
 <br/>
 
### Challenges faced

  - Timezones within datetime objects
  - Uppy & multer (renaming file within a single process)
<br/>

### Current limitations

  - No option to add multiple timezones
<br/>

### Future Improvements

  - Currently the process has a manual handling of the patient image upload
    - for the face recognition to work the image must manually be transferred to the IoT device, it would be nice if this could be automated in the cloud
  - Face recognition to have a check, only sending the automatic arrival email IF the patient has a booking within the next hour, otherwise the patient will be notfied to visit the front desk.
<br/>


### Installation instructions
1. Clone the repo.
2. Run the python script on an IoT device (a background process perhaps)
3. Create a cloud MongoDB database and place the generated network access URL in a .env file with the key of MONGO_URL
4. Using a Google developer account, generate client and secret keys for the google calendar API and add to .env in the following format:
  - CLIENT_ID = ...
  - CLIENT_SECRET = ...
5. Create a environment variable for JWT authentication token secret, using the format: JWT_SECRET
6. In order for nodemailer to send an automatic email, having a GMAIL account and adding the following to .env will work
  - EMAIL_USER = <gmail email address>
  - PASS = <gmail email password>
  - SERVICE = <service smtp provided by google or other option>
7. Navigate to directory 'server_side' and run: npm start