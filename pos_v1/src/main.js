//TODO: Please write code in this file.

function printInventory(inputs){
    var buyedBarcodes = getbuyedBarcodes(inputs);
    var buyedItems = getBuyedItems(buyedBarcodes);
    var gifts = getGifts(buyedItems);
    var paidItems = getPaidItems(buyedItems,gifts);
    var summary = countTotal(paidItems,gifts);
    printBuyedList(paidItems,gifts,summary);
}
/**
 * #1.计数
 * @param inputs
 * @returns {Array}
 */
function getbuyedBarcodes(inputs){
    var buyedBarcodesObject = {};
    var buyedBarcodes = [];
    for (var i=0; i<inputs.length; i++){
        if (inputs[i].indexOf('-' != "-1")){
            //包含“-”的情况
            var splitArray = inputs[i].split('-');
            var count = parseInt(splitArray[1]);
            countChar(buyedBarcodesObject,splitArray[0],count);
        }
        else{
            //不包含“-”的情况
            countChar(buyedBarcodesObject,inputs[i],1);
        }
    }
    /**
     * 给给定字符计数
     * @param object
     * @param char
     * @param count
     */
    function countChar(object,char,count){
        if (!object[char]){
            object[char] = count;
        }
        else{
            object[char] += count;
        }
    }
    for (var key in buyedBarcodesObject){
        buyedBarcodes.push({
            barcode:key,
            count:buyedBarcodesObject[key]
        });
    }
    return buyedBarcodes;
}

/**
 * #2.获取购买的商品的详细信息
 * @param buyedBarcodes
 * @returns {Array}
 */
function getBuyedItems(buyedBarcodes){
    var buyedItems = [];
    var allItems = loadAllItems();
    for (var i=0; i<buyedBarcodes.length; i++){
        for (var j=0; j<allItems.length; j++){
            if (buyedBarcodes[i].barcode == allItems[j].barcode){
                buyedItems.push(allItems[j]);
                buyedItems[i].count = buyedBarcodes[i].count;
                break;
            }
        }
    }
    return buyedItems;
}

/**
 * #3.计算优惠
 * @param buyedItems
 * @returns {Array}
 */
function getGifts(buyedItems){
    var gifts = [];
    var barcodes = [];
    //先得到参加优惠活动的所有信息
    var promotions = loadPromotions();
    //再得到参加“买二赠一”活动的条形码数组
    for (var i=0; i<promotions.length; i++){
        if (promotions[i].type == 'BUY_TWO_GET_ONE_FREE'){
            barcodes = promotions.barcodes;
        }
    }
    //最后根据参加活动的条形码数组获取购买商品中的优惠数据
    for (var i=0; i<barcodes.length; i++){
        for (var j=0; j<buyedItems.length; j++){
            if (buyedItems[j].barcode == barcodes[i]){
                //此时该商品参加“满二送一”的优惠活动
                var freeCount = buyedItems[j].count / 3;
                if (freeCount >= 1){
                    gifts.push({
                        barcode:buyedItems[j].barcode,
                        name:buyedItems[j].name,
                        unit:buyedItems[j].unit,
                        count:freeCount
                    });
                }
                break;
            }
        }
    }

    return gifts;
}

/**
 * #4.计算小计
 * @param buyedItems
 * @param gifts
 * @returns {getPaidItems}
 */
function getPaidItems(buyedItems,gifts){
    var paidItems = [];
    if (buyedItems && buyedItems.length){
        buyedItems.forEach(function (item){
            var subtotal;
            var subFreeTotal = 0;
            for (var i=0; i<gifts.length; i++){
                if (gifts[i].barcode == item.barcode){
                    subFreeTotal = item.price * gifts.count;
                    break;
                }
            }
            subtotal = item.price * item.count + subFreeTotal;
            paidItems.push({
                name:item.name,
                unit:item.unit,
                price:item.price,
                count:item.count,
                subFreeTotal:subFreeTotal,
                subtotal:subtotal
            });
        });
    }
    return paidItems;
}

/**
 * #5.计算总计和节省
 * @param paidItems
 * @param gifts
 */
function countTotal(paidItems,gifts){
    var summary = {
        total:0,
        sava:0
    };
    if (paidItems && paidItems.length){
        paidItems.forEach(function (item){
            summary.total += item.subtotal;
            summary.save += item.subFreeTotal;
        });
    }
    return summary;
}
/**
 * 打印清单
 * @param paidItems
 * @param gifts
 * @param summary
 */
function printBuyedList(paidItems,gifts,summary){
    console.log('***<没钱赚商店>购物清单***\n');
    if (paidItems && paidItems.length){
        paidItems.forEach(function(item){
            console.log("名称："+item.name+"，数量："+item.count+item.unit+"，单价："+item.price+"（元），小计："+item.subtotal+"(元)\n");
        });
    }
    console.log('----------------------\n');
    console.log('挥泪赠送商品：\n');
    if (gifts && gifts.length){
        gifts.forEach(function (gift){
            console.log("名称："+gift.name+"，数量："+gift.count+gift.unit+"\n");
        });
    }
    console.log('----------------------\n');
    console.log("总计："+summary.total+"（元）\n");
    console.log("总计："+summary.save+"（元）\n");
    console.log('**********************');
}







