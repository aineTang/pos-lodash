//TODO: Please write code in this file.

function printInventory(inputs){
    //1.整理特殊值
    var resetedInputs = resetInput(inputs);
    //2.获取要购买的条形码数量
    var buyedBarcodes = getBuyedBarcodes(resetedInputs);
    //3.获取要购买的商品的详细信息
    var buyedItems = getBuyedItems(buyedBarcodes);
    //4.获取优惠的商品信息
    var gifts = getGifts(buyedItems);
    //5.获取要购买的所有商品的信息（包括小计）
    var paidItems = getPaidItems(buyedItems,gifts);
    //6.获取应付总额以及节省的钱
    var summary = countTotal(paidItems,gifts);
    //7.打印清单
    printBuyedList(paidItems,gifts,summary);
}
/**
 * #1.重置input，整理特殊值
 * @param inputs
 */
function resetInput(inputs){
    var resetedInputs = [];
    if (inputs && inputs.length){
        _.forEach(inputs, function(input) {
            if (input.indexOf('-') != -1){
                //存在特殊字符
                var splitArray = input.split('-');
                for (var i=0; i<splitArray[1];i++){
                    resetedInputs.push(splitArray[0]);
                }
            }
            else{
                //不存在特殊字符
                resetedInputs.push(input);
            }
        });
    }
    return resetedInputs;
}

/**
 * #2.计数
 * @param resetedInputs
 * @returns {Array}
 */
function getBuyedBarcodes(resetedInputs){
    return _.countBy(resetedInputs);
}

/**
 * #3.获取购买的商品的详细信息
 * @param buyedBarcodes
 * @returns {Array}
 */
function getBuyedItems(buyedBarcodes){
    var buyedItems = [];
    //1.先获取所有的商品信息
    var allItems = loadAllItems();
    //2.获取购买的商品的详细信息
    buyedItems = _.filter(allItems, function (item){
        if (buyedBarcodes[item.barcode]){
            return true;
        }
    });
    //3.获取购买商品的数量
    _.map(buyedItems,function (item){
        if (buyedBarcodes[item.barcode]){
            item.count = buyedBarcodes[item.barcode];
        }
    });
    return buyedItems;
}

/**
 * #4.计算出优惠的商品
 * @param buyedItems
 * @returns {Array}
 */
function getGifts(buyedItems){
    var gifts;
    var barcodes = [];
    //1.得到参加优惠活动的所有信息
    var promotions = loadPromotions();
    //2.获取参加“买二送一”优惠活动商品的条形码
    barcodes = _.result(
        _.find(promotions,function (promotion){
            return promotion.type == "BUY_TWO_GET_ONE_FREE";
        }), 'barcodes');

    //3.先找出做活动的商品
    var promotionItems = _.filter(buyedItems,function (item){
        for (var i=0; i<barcodes.length; i++){
            if (barcodes[i] == item.barcode){
                return true;
            }
        }
    });
    // 4.根据参加活动的条形码数组获取购买商品中的优惠数据
    gifts = _.map(promotionItems,function (item){
        var freeCount = Math.floor(item.count / 3);
        if (freeCount >= 1){
            return {
                barcode:item.barcode,
                name:item.name,
                unit:item.unit,
                count:freeCount
            }
        }
    });
    return gifts;
}

/**
 * #5.计算小计
 * @param buyedItems
 * @param gifts
 * @returns {getPaidItems}
 */
function getPaidItems(buyedItems,gifts){
    var paidItems = _.map(buyedItems,function (item){
        var subtotal;
        var subFreeTotal = 0;
        for (var i=0; i<gifts.length; i++){
            if (gifts[i].barcode == item.barcode){
                subFreeTotal = item.price * gifts[i].count;
                break;
            }
        }
        subtotal = item.price * item.count - subFreeTotal;
        return {
            name:item.name,
            unit:item.unit,
            price:item.price,
            count:item.count,
            subFreeTotal:subFreeTotal,
            subtotal:subtotal
        };
    });
    return paidItems;
}
/**
 * #5.计算总计和节省
 * @param paidItems
 */
function countTotal(paidItems){
    var summary = {
        total:0,
        save:0
    };
    _.forEach(paidItems,function (item){
        summary.total += item.subtotal;
        summary.save += item.subFreeTotal;
    });
    return summary;
}
/**
 * 打印清单
 * @param paidItems
 * @param gifts
 * @param summary
 */
function printBuyedList(paidItems,gifts,summary){
    var logString = "";
    logString += '***<没钱赚商店>购物清单***\n';
    if (paidItems && paidItems.length){
        paidItems.forEach(function(item){
            logString += "名称："+item.name+"，数量："+item.count+item.unit+"，单价："+item.price.toFixed(2)+"（元），小计："+item.subtotal.toFixed(2)+"(元)\n";
        });
    }
    logString += '----------------------\n';
    logString += '挥泪赠送商品：\n';
    if (gifts && gifts.length){
        gifts.forEach(function (gift){
            logString += "名称："+gift.name+"，数量："+gift.count+gift.unit+"\n";
        });
    }
    logString += '----------------------\n';
    logString += "总计："+summary.total.toFixed(2)+"（元）\n";
    logString += "总计："+summary.save.toFixed(2)+"（元）\n";
    logString += '**********************';
    console.log(logString);
}







