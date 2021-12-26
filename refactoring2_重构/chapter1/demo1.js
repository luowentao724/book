/**
 * 重构示例：戏剧演出团
 * 客户（customer）
 * 观众（audience）
 * 戏剧类型：悲剧（tragedy）和 喜剧（comedy）
 * 观众量积分优惠（volume credit）下次客户再请剧团表演时可以使用积分获得折扣
 * 重构前代码
 */

// 剧团剧目存储json
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

// 打印账单详情 方法
function statement(invoices, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoices.customer}\n`
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;

    for (let perf of invoices.performances) {
        const play = plays[perf.playId];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknwn type: ${play.type}`);
        }

        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === play.type) {
            volumeCredits += Math.floor(perf.audience / 5);
        }
        // print line for this order
        result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;

    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

}


