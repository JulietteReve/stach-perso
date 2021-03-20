export default function(user = {}, action){     
    if(action.type == 'user'){
        var userCopy = action.user;
        console.log(action.user)
        return userCopy
    } else if (action.type == 'noUser') {
        var userCopy = {}
        return userCopy
    } else {
    return user
    }
}