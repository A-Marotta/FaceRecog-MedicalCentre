const { google } = require('googleapis')
const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
)

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client
})

module.exports = calendar

// GOOGLE CAL LIST CODE

    // calendar.events.list({
    //     calendarId: 'rsanchez.medcentre@gmail.com',
    //     timeMin: startTime,
    //     timeMax: endTime,
    //     singleEvents: true,
    //     orderBy: 'startTime',
    // }, (err, res) => {
    //     if (err) return console.log('The API returned an error: ' + err);
    //     const events = res.data.items;
    //     events.map((event, i) => {
    //         if(!event.hasOwnProperty('transparency')) {
    //             const start = event.start.dateTime || event.start.date;
    //             console.log(`${start} - ${event.summary}`);
    //         }
    //     });