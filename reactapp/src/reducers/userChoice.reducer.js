export default function(userChoice = {}, action){     
    if(action.type == 'addUserChoice'){
        var userChoiceCopy = action.userChoice
        return userChoiceCopy
    } else {
    return userChoice
    }
}