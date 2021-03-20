export default function(selectedShop = {}, action){     
    if(action.type == 'selectShop'){
        var selectedShopCopy = action.shop
        return selectedShopCopy
    } else if (action.type == 'deselectShop') {
        var selectedShopCopy = {}
        return selectedShopCopy
    } else {
    return selectedShop
    }
}