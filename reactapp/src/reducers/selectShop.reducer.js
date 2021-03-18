export default function(selectedShop = {}, action){     
    if(action.type == 'selectShop'){
        var selectedShopCopy = action.shop
        return selectedShopCopy
    } else {
    return selectedShop
    }
}