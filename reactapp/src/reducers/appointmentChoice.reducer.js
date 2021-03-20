export default function(appointmentChoice = {}, action){     
    if(action.type == 'addAppointmentChoice'){
        var appointmentChoiceCopy = action.appointmentChoice
        return appointmentChoiceCopy
    } else if (action.type == 'deleteAppointmentChoice') {
        var appointmentChoiceCopy = {}
        return appointmentChoiceCopy
    } else {
    return appointmentChoice
    }
}