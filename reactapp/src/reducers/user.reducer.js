export default function(user = {}, action){     
    if(action.type == 'user'){
        var userCopy = action.user
        return userCopy
    } else {
    return user
    }
}