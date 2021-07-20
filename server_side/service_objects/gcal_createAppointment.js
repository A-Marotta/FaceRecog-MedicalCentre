const calendar = require('./gcal_api')

function createGoogleCalendarAppointment(doctor_name, doctor_email, patient_name, patient_mobile, start, endTime) {
    return new Promise(function(resolve, reject) {
        let success = false    
        const startTime = start
        .split('T')[1]
        .split('+')[0]

        const booking = {
            summary: `${doctor_name} booking with ${patient_name}`,
            location: '145 Cecil St, South Melbourne VIC 3205',
            description: `booking with ${patient_name} (${patient_mobile})at ${startTime}`,
            start: {
                dateTime: start,
                timeZome: 'Australia/Melbourne'
            },
            end: {
                dateTime: endTime,
                timeZome: 'Australia/Melbourne'
            },
            reminders: {
                "useDefault": false,
                "overrides": []
            },
            colorId: 11,
        }

        // Check if the doctor is busy and add an event on our calendar for the same time.
        calendar.freebusy.query({
                resource: {
                    timeMin: start,
                    timeMax: endTime,
                    timeZone: 'Australia/Melbourne',
                    items: [{ id: doctor_email }],
                },
            }, (err, res) => {
                if (err) return console.error('Free Busy Query Error: ', err)
            
                const eventArr = res.data.calendars[doctor_email].busy

                // Check if event array is empty which means we are not busy
                if (eventArr.length === 0) {
                    calendar.events.insert({ calendarId: doctor_email, resource: booking }, (err, res) => {
                        if (err) return console.error('Error Creating Calender Event:', err)

                        
                        console.log('Calendar event successfully created.')
                        success = true
                        resolve({
                            success: success, 
                            event_id: res.data.id
                        })
                    })
                } else {
                    success = 'Calendar conflict.'
                    reject(success)
                }
        })
    })
}

module.exports = createGoogleCalendarAppointment