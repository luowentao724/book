// 超实用的重构方法，用多态取代条件表达式
/**
 * 范例：我的朋友用一群鸟儿，他想知道这些鸟飞得有多快，以及它们的羽毛是什么养的。
 * 所以我写了一小段程序来判断这些信息
 */

function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]))
}

function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]))
}

function plumage(bird) {
    switch (bird.type) {
        case "EuropeanSwallow":
            return "average";
        case "AfricanSwallow":
            return (bird.numberOfCoconuts > 2) ? "tired" : "average"
        case "NorwegianBlueParrot":
            return (bird.voltage > 100) ? "scorched" : "beautiful";
        default:
            throw "unknown";
    }
}

function airSpeedVelocity(bird) {
    switch (bird.type) {
        case "EuropeanSwallow":
            return 35;
        case "AfricanSwallow":
            return 40 - 2 * bird.numberOfCoconuts
        case "NorwegianBlueParrot":
            return (bird.isNailed) ? 0 : 10 + bird.voltage / 10
        default:
            throw "unknown";
    }
}

// 先对 airSpeedVelocity 和 plumage 两个函数组合成类
function plumage(bird) {
    return new Bird(bird).plumage;
}

function airSpeedVelocity(bird) {
    return new Bird(bird).airSpeedVelocity;
}

class Bird {
    constructor(birdObject) {
        Object.assign(this, birdObject)
    }

    get plumage(bird) {
        switch (bird.type) {
            case "EuropeanSwallow":
                return "average";
            case "AfricanSwallow":
                return (bird.numberOfCoconuts > 2) ? "tired" : "average"
            case "NorwegianBlueParrot":
                return (bird.voltage > 100) ? "scorched" : "beautiful";
            default:
                throw "unknown";
        }
    }

    get airSpeedVelocity(bird) {
        switch (bird.type) {
            case "EuropeanSwallow":
                return 35;
            case "AfricanSwallow":
                return 40 - 2 * bird.numberOfCoconuts
            case "NorwegianBlueParrot":
                return (bird.isNailed) ? 0 : 10 + bird.voltage / 10
            default:
                throw "unknown";
        }
    }
}

// 然后针对每种鸟创建一个子类

function plumage(bird) {
    return createBird(bird).plumage;
}

function airSpeedVelocity(bird) {
    return createBird(bird).airSpeedVelocity;
}

function createBird(bird) {
    switch (bird.type) {
        case "EuropeanSwallow":
            return new EuropeanSwallow(bird);
        case "AfricanSwallow":
            return new AfricanSwallow(bird);
        case "NorwegianBlueParrot":
            return new NorwegianBlueParrot(bird);
        default:
            throw new Bird(bird);
    }
}

class EuropeanSwallow extends Bird {
}

class AfricanSwallow extends Bird {
}

class NorwegianBlueParrot extends Bird {
}

// 从switch语句中选一个分支，在适当的子类中重写这个逻辑
function plumages(birds) {
    return new Map(birds
        .map(b => createBird(b))
        .map(bird => [bird.name,bird.plumage])
        )
}

function speeds(birds) {
    return new Map(birds
                    .map(b => createBird(b))
                    .map(bird => [bird.name , bird.airSpeedVelocity])
                )
}

function createBird(bird) {
    switch (bird.type) {
        case "EuropeanSwallow":
            return new EuropeanSwallow(bird);
        case "AfricanSwallow":
            return new AfricanSwallow(bird);
        case "NorwegianBlueParrot":
            return new NorwegianBlueParrot(bird);
        default:
            throw new Bird(bird);
    }
}

class Bird {
    constructor(birdObject) {
        Object.assign(this, birdObject)
    }

    get plumage() {
        throw "unknown";
    }

    get airSpeedVelocity() {
        throw "unknown";
    }
}

class EuropeanSwallow extends Bird {
    get plumage() {
        return "average";
    }

    get airSpeedVelocity() {
        return 35;
    } 
}

class AfricanSwallow extends Bird {
    get plumage() {
        return (this.numberOfCoconuts > 2) ? "tired" : "average"
    }

    get airSpeedVelocity() {
        return 40 - 2 * this.numberOfCoconuts
   } 
}

class NorwegianBlueParrot extends Bird {
    get plumage() {
        return (this.voltage > 100) ? "scorched" : "beautiful";
    }

    get airSpeedVelocity() {
        return (this.isNailed) ? 0 : 10 + this.voltage / 10
    } 
}


/**
 * 范例二： 用多态处理变体逻辑
 * 上面那个范例是属于教科书式的范例，有一个鸟作为 超类，子类是不同的鸟 ，而这并不是最常用或者最好的方式
 * 另一种继承的情况是： 我想表达某一个对象与另一个对象大体相似，但又有一些不同之处
 * 下面有一个这样的例子：有一家评级机构，要对远洋航船的航行进行投资评级。这家评级机构会给出 “A” 或 “B” 两种评级
 * 取决于多种风向和盈利潜力的因素。在评估风险时，既要考虑航程本身的特征，也要考虑船长过往航行的历史
 */

function rating(voyage, history) {
    const vpf = voyageProfitFactor(voyage, history);
    const vr = voyageRisk(voyage);
    const chr = captainHistoryRisk(voyage, history);
    if(vpf * 3 > (vf + chr * 2)) return "A";
    return "B"
}

function voyageRisk(voyage) {
    let result = 1;
    if (voyage.length > 4) result += 2;
    if (voyage.length > 8) result += voyage.length - 8;
    if (["china","east-indies"].includes(voyage.zone)) result += 4;
    return Math.max(result, 0);
}

function captainHistoryRisk(voyage, history) {
    let result = 1;
    if(history.length < 5) result += 4;
    result += history.filter(v => v.profit < 0).length;
    if (voyage.zone === "china" && hasChina(history)) result -= 2;
    return Math.max(result, 0);
}

function hasChina(history) {
    return history.some(v => "china" === v.zone);
}

function voyageProfitFactor(voyage, history) {
    let result = 2;
    if (voyage.zone === "china") result += 1;
    if (voyage.zone === "eash-indies") result += 1;
    if (voyage.zone === "china" && hasChina(history)) {
        result += 3;
        if(history.length > 10) result += 1;
        if(history.length > 12) result += 1;
        if(history.length > 18) result -= 1;
    }
    else {
        if (history.length > 8) result += 1;
        if (history.length > 14) result -= 1;
    }
    return result;
}