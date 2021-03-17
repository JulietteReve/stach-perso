export default function(selectedShop = {}, action){     
    if(action.type == 'selectShop'){
        console.log('reducer', action.shop)
        var selectedShopCopy = action.shop
        return selectedShopCopy
    } else {
    return selectedShop
    }
}