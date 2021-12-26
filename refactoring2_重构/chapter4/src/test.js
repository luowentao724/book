/**
 * 
 * 行省 province 生产计划 
|  Province : Asia ||
|  ----  | ----  |
| demand（需求量）  | 30 |
| price （采购价格） | 20 |

 producers
|  producer(生产商) | cost(成本价) | production(产量) | full revenue(总收入)|
|  ----  | ----  | ---- | ---- | 
| Byzantium | 10  | 9 | 90
| Attalia  | 12 | 10 | 120
| Sinope  | 10 | 6 | 60

shortfall(需求量减去总产量) : 5  | profit(总利润): 230
 */

class Province{

    constructor(doc) {
        this._name = doc.name;
        this._producers = [];
        this._totalProduction = 0;
        this._demand = doc.demand;
        this._price = doc.price;
        doc.producers.forEach(d => this.addProducer(new Producer(this,d)));
    }

    addProducer(arg) {
        this._producers.push(arg);
        this._totalProduction += arg.production;
    }
    
    get name() {
        return this._name;
    }

    get producers() {
        return this._producers.slice();
    }

    get totalProduction() {
        return this._totalProduction;
    }

    set totalProduction(arg) {
        this._totalProduction = arg;
    }

    get demand() {
        return this._demand;
    }

    set demand(arg){
        this._demand = parseInt(arg);
    }

    get price() {
        return this._price;
    }

    set price(arg) {
        this._price = parseInt(arg);
    }

    get shortfall() {
        return this._demand - this.totalProduction;
    }

    // 计算利润
    get profit() {
        return this.demandValue - this.demandCost;
    }
    get demandCost() {
        let remainingDemand = this.demand;
        let result = 0;
        this.producers
            .sort((a,b) => a.cost - b.cost)
            .forEach(p => {
                const contribution = Math.min(remainingDemand,p.production);
                remainingDemand -= contribution;
                result += contribution * p.cost;
            })
            return result;
    }

    get demandValue() {
        return this.satisfiedDemand * this.price;
    }

    get satisfiedDemand () {
        return Math.min(this._demand,this.totalProduction);
    }
}

function sampleProvinceData() {
    return {
        name: "Asia",
        producers: [
            {name: "Byzantium",cost: 10,production: 9},
            {name: "Attalia",cost: 12,production: 10},
            {name: "Sinope",cost: 10,production: 6}
        ],
        demand: 30,
        price:20
    }
}

class Producer {
    constructor(aProvince,data) {
        this._province = aProvince;
        this._cost = data.cost;
        this._name = data.name;
        this._production = data.production || 0;
    }

    get name() {
        return this._name;
    }
    get cost() {
        return this._cost;
    }
    set cost(arg){
        this._cost = parseInt(arg);
    }
    get production() {
        return this._production;
    }

    set production(amountStr) {
        const amount = parseInt(amountStr);
        const newProduction = Number.isNaN(amount) ? 0 : amount;
        this._province.totalProduction += newProduction - this._production;
        this._production = newProduction;
    }

}

/**
 * 为上面代码添加第一个测试
 */
var assert = require('assert');
describe('province',function() {
    let asia;
    // beforeEach 会在每个测试之前运行一篇，将asia 变量清空
    beforeEach(() =>{
        asia = new Province(sampleProvinceData());
    })
    it('shortfall',(done) => {
        assert.equal(asia.shortfall, 5);
        done();
    });
    it('profit',(done) =>{
        assert.equal(asia.profit, 230);
        done();
    });
    it('change production',() => {
        asia.producers[0].production = 20;
        assert.equal(asia.shortfall,-6);
        assert.equal(asia.profit,292);
    })
});

