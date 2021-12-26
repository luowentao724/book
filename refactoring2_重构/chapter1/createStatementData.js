export default function createStatementData(invoice, plays){
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance){
        const result = Object.assign({},aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.totalAmount = amountFor(result);
        result.volumeCreditsFor = volumeCreditsFor(result);
        return result;
    }

    /**
     * statement 方法太过臃肿，需要分解函数，先将switch 提炼出来
     */
    function playFor(aPerformance){
        return plays[aPerformance.playId]
    }
    function amountFor(aPerformance){
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknwn type: ${aPerformance.play.type}`);
        }
        return result;
    }

    // 提炼计算观众积分量积分的逻辑
    function volumeCreditsFor(aPerformance){
        let result = 0;
        // add volume credits
        result += Math.max(aPerformance.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === aPerformance.play.type) {
            result += Math.floor(aPerformance.audience / 5);
        }
        return result;
    }

    function totalAmount(data){
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits;
        }
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }
}