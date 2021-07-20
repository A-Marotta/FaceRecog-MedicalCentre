const calendar = require('./gcal_api')

function createCalendarAvailablity(doctor_name, email, start, end) {
    let [date, startTime] = start.split('T')
    date = date.split('-').reverse().join('/')

    const startHour = startTime
        .split('+')[0]

    const endHour = end
        .split('T')[1]
        .split('+')[0]

    const available = {
        summary: `${doctor_name} doctor availability`,
        location: '145 Cecil St, South Melbourne VIC 3205',
        description: `${doctor_name}, hours available for booking appointments are between ${startHour} and ${endHour} on ${date}`,
        start: {
            dateTime: start,
            timeZome: 'Australia/Melbourne'
        },
        end: {
            dateTime: end,
            timeZome: 'Australia/Melbourne'
        },
        transparency: "transparent",
        colorId: 1
    }
    
    calendar.events.insert({
        calendarId: email,
        resource: available
      }, function(err, available) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: %s', available.htmlLink);
    });
} 

module.exports = createCalendarAvailablity