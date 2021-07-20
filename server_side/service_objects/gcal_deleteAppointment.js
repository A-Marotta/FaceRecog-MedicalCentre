const calendar = require('./gcal_api')

function deleteGoogleCalEvent(eventId, doctor_email) {
    return new Promise(function(resolve, reject) {
        let success = false
        const params = {
            calendarId: doctor_email,
            eventId: eventId,
        }

        calendar.events.delete(params, function(err) {
        if (err) {
            console.log('Deleting calendar error: ' + err)
            reject(success)
        }
        else {
            console.log('Event deleted.')
            success = true
            resolve({ success })
        }
        
        })
    })
}

module.exports = deleteGoogleCalEvent