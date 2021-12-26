/**
 * 重构示例：戏剧演出团
 * 客户（customer）
 * 观众（audience）
 * 戏剧类型：悲剧（tragedy）和 喜剧（comedy）
 * 观众量积分优惠（volume credit）下次客户再请剧团表演时可以使用积分获得折扣
 * 重构后代码
 */

// 剧团剧目存储json
function createStatementData(invoice, plays){
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance){
        const calculator = createPerformanceCalculator(aPerformance,playFor(aPerformance));
        const result = Object.assign({},aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance){
        return plays[aPerformance.playId]
    }

    function totalAmount(data){
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }
}

const plays = {
    "hamlet": { "name": "Hamlet", "type": "tragedy", },
    "as-like": { "name": "As You Like It", "type": "comedy", },
    "othello": { "name": "Othello", "type": "tragedy", }
}

// 账单 json
const invoices = [
    {
        "customer": "BigCo",
        "performances": [
            {
                "playId": "hamlet",
                "audience": 55
            },
            {
                "playId": "as-like",
                "audience": 35
            },
            {
                "playId": "othello",
                "audience": 40
            }
        ]
    }
]

function htmlStatement (invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml (data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
    for (let perf of data.performances) {
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}


function usd(aNumber){
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
}

// 打印账单详情 方法
function renderPlainText(data,plays) {
    let result = `Statement for ${data.customer}\n`
    for (let perf of data.performances) {
        // print line for this order
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;

}

function statement(invoice,plays) {
    return renderPlainText(createStatementData(invoice,plays))
}

function createPerformanceCalculator(aPerformance, aPlay){
    switch(aPlay.type){
        case "tragedy":
            return new TragedyCalculator(aPerformance,aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance,aPlay);
        default:
            throw new Error(`unknown type: ${aPlay.type}`)
    }
}

class PerformanceCalculator {
    constructor(aPerformance,aPlay){
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount(){
        throw new Error('subclass responsibility');
    }

    // 提炼计算观众积分量积分的逻辑
    get volumeCredits(){
        return Math.max(this.performance.audience - 30, 0);
    }

}

class TragedyCalculator extends PerformanceCalculator{
    get amount(){
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }

    // 提炼计算观众积分量积分的逻辑
    get volumeCredits(){
        return Math.max(this.performance.audience - 30, 0);
    }

}
class ComedyCalculator extends PerformanceCalculator{
    get amount(){
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    // 提炼计算观众积分量积分的逻辑
    get volumeCredits(){
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }

}



console.log(statement(invoices[0],plays))