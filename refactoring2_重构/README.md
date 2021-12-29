# 重构 改善既有代码设计（第二版） 美 马丁-福勒著

## 第一章 重构，第一个示例

### 重构第一步
* 确保即将修改的代码拥有一组可靠的测试：Junit 编写测试用例
    > 这样有助于重构后 迅速检查代码是否正确
* 重构方法提炼函数（106）: 将大函数中的部分代码提取出来作为一个小函数
* 以查询取代临时变量（178）: playFor(perf)
* 使用内联变量（123）手法：play 变量 直接用上面的方法代替变量
* 改变函数声明（124）： 移除 amountFor 函数 play 参数
* 拆分循环（227）：分离出累加过程
* 使用移动语句（223）将累加变量声明与累加过程集中到一起
* 拆分阶段（154）：实现复用
* 以多态取代条件表达式（272）
* 以工厂函数取代构造函数（334）

## 第二章 重构的原则

### 何为重构？
重构（名词）：对软件内部结构的一种调整，目的是不改变软件的可观察行为的前提下，提高其可理解性，降低其成本。   
重构（动词）：使用一系列重构手法，在不改变软件可观察行为的前提下，调整其结构
    > 如果有人说他们的代码在重构过程中有一两天时间不可用，基本上可以确定，他们在做的事不是重构

### 两顶帽子
使用重构技术开发软件时，我把自己的时间分配给两种截然不同的行为：
* 添加新功能时我们不应该修改即有代码，只管添加新功能
* 重构时我就不能再添加功能，只管调整代码的结构。

### 为什么要重构？
1. 重构改善软件的设计
 > 如果没有重构，程序的内部设计（或者叫架构）会逐渐腐败变质。
2. 重构使软件更容易理解
 > 所谓程序设计，很大程度上就是与计算机对话：我编写代码告诉计算机做什么事，而它的响应是按照指示精确行动。 
 > 大家肯定有那种自己写的代码过几天再看时，自己都看不懂了。
3. 重构帮忙找到bug
 > 重构过程中我们需要阅读代码，深度理解后，才能重构，所以可以帮我们找到bug
4. 重构提高编程速度
 > 一个良好的软件让我可以很容易找到那里修改，如何修改。
 > 设计耐久性假说: 通过投入精力改善内部设计，我们增加了软件的耐久性，从而可以更长时间的保持开发

### 何时重构
> 三次法则：第一次做某件事时只管去做，第二次做类似的事会产生反感，第三次做类似的事，就应该重构，事不过三
1. 预备性重构：让添加新功能更容易
> 重构的最佳时间是添加新功能之前
2. 帮助理解的重构：使代码更易懂
> 我需要先理解代码在做什么，然后才能着手修改
3. 捡垃圾式重构
> 我已经理解代码在做什么，但发现它做的不好，例如逻辑不必要的迂回复杂，或者两个函数几乎完全相同，可以用一个参数化的函数取而代之
4. 有计划的重构和见机行事重构
> 上面的三种例子都是见机行事重构：并不需要安排一段时间来重构，而是在添加功能或修改bug的同时顺便重构。
5. 复审代码时重构
> 重构可以帮助我复审别人的代码
> 重构还可以帮助代码复审工作得到更具体的结果

## 代码的坏味道

### 神秘命名（Mysterious Name）
> 命名是编程中最难的两件事之一。改名可能是最常用的重构手法。包括 函数声明，变量改名，字段改名等。
> 改名不仅仅是修改名字而已。如果你想不出一个好名字，说明背后很有可能潜藏着更深的设计问题。(可能设计本身就不清晰)

### 重复代码（Duplicated Code）
> 如果你在一个以上的地点看到相同的代码结构，那么可以肯定：设法将它们合二为一，程序会变的更好。

### 过长函数（Long Funcition）
> * 小函数的价值：更好的阐释力，更易于分享，更多的选择
> * 函数越长：越难以理解。
> * 原则：每当感觉需要以注释来说明点什么的时候，我们就需要把说明点东西写进一个独立函数中，并以其用途命名。
> * 对一组甚至一行代码做这件事。只要函数名称能解释其用途，我们也该毫不犹豫的去做。
> * 关键不在于函数的长度，而在于函数“做什么” 和 “如何做” 之间语义距离

### 过长参数列表（Long Parameter List）
> * 如果可以向某个参数发起查询而获得另一个参数的值，那么就可以使用以查询取代参数去掉着第二个参数
> * 使用类可以有效的缩短参数列表

### 全局数据（Global Data）
> * 全局数据的问题在于，从代码库的任何一个角落都可以修改它，而且没有任何机制可以探测出到底那段代码作出了修改
> * 全局最显而易见的形式就是会全局变量，但类变量和单列也有这样的问题。
> * 首要的防御手段是封装变量。用一个函数包装起来。

### 可变数据（Mutable Data）
> * 对数据的修改经常导致出乎意料的结果和难以发现的bug
> * 如果要更新一个数据结构，就返回一份新的数据副本，旧的数据仍保持不变。
> * 可以用封装变量来确保所有数据更新操作都通过很少几个函数进行，使其更容易监控和演进。

### 发散式变化（Divergent Change）
> * 一旦需要修改，我们希望能够跳到系统的某一点，只在该处做修改。而不是要修改好几个地方。

### 散弹式修改（Shotgun Surgery）
> * 如果没遇到某种变化，你都必须做许多不同的类做出很多小修改，就是散弹式修改。
> * 搬移函数，搬移字段，函数组合成类，函数整合成变换，内联函数，内联类等修改手段。

### 依恋情结（Feature Envy）
> * 一个函数跟另一个模块中的函数或者数据交流格外频繁，远胜于在自己所在模块内部的交流，这就是依恋情结的典型情况。

### 数据泥团（Data Clumps）
> * 两个类中相同的字段，许多函数签名中相同的参数。

### 基本类型偏执（Primitive Obsession）
> * 如果你有一组总是同时出现的基本类型数据，这就是数据泥团的征兆，应该运用提炼类 和 引入参数对象来处理

### 重复的switch （ Repeated Switches）
> * 任何switch 语句都应该用以多态取代条件表达式（272）消除掉

### 循环语句（Loops）
> * 以管道取代循环是新时代最好的方式。
> * 管到操作 filter 和 map 可以帮助我们更快的看清被处理的元素以及处理它们的动作。

### 818-618-6216
> * 描述：元素指类和函数，但是这些元素可能因为种种原因，导致函数过于小，导致没有什么作用，以及那些重复的，都可以算作冗赘
> * 重构：内联函数、内联类、折叠继承类

### 夸夸其谈通用型（Speculative Generality）
> * 过度设计
> * 重构：折叠继承体系，内联函数，内联类等

### 临时字段（Temporary Field）
> * 有时你会看到这样的类：其内部某个字段仅为某种特定的情况而设
> * 重构：提炼类 -> 搬移函数 

### 过长的消息链（Message Chains）
> * 如果你看到用户向一个对象请求另一个对象，然后再向后者请求另一个对象，然后再请求另一个对象 ...... 这就是消息链。
> * 重构：隐藏委托关系

### 中间人（Middle Man）
> * 对象的基本特征之一就是封装 --- 对外部世界隐藏起内部细节。封装往往伴随着委托。过度委托：例如某个类的某个接口有一半的函数都委托给其他类。
> * 重构：移除中间人，内联函数

### 内幕交易（Lnsider Trading）
> * 描述：两个模块的数据频繁的私下交换数据（可以理解为在程序的不为人知的角落），这样会导致两个模块耦合严重，并且数据交换隐藏在内部，不易被察觉
> * 重构：搬移函数、隐藏委托关系、委托取代子类、委托取代超类

### 过大的类（Large Class）
> * 描述：单个类做了过多的事情，其内部往往会出现太多字段，一旦如此，重复代码也就接踵而至。这也意味着这个类绝不只是在为一个行为负责
> * 重构：提炼超类、以子类取代类型码

### 异曲同工的类（Alternative Classes with Different Interfaces）
> * 描述：两个可以相互替换的类，只有当接口一致才可能被替换
> * 重构：改变函数声明、搬移函数、提炼超类

### 纯数据类（Data Class）
> * 描述：拥有一些字段以及用于读写的函数，除此之外一无是处的类，一般这样的类往往半一定被其他类频繁的调用（如果是不可修改字段的类，不在此列，不可修改的字段无需封装，直接通过字段取值即可），这样的类往往是我们没有把调用的行为封装进来，将行为封装进来这种情况就能得到很大改善。
> * 重构：封装记录、移除取值函数、搬移函数、提炼函数、拆分阶段

### 被拒绝的遗赠 （Refused Bequest）
> * 描述：这种味道比较奇怪，说的是继承中，子类不想或不需要继承某一些接口，我们可以用函数下移或者字段下移来解决，但不值得每次都这么做，只有当子类复用了超类的行为却又不愿意支持超类的接口时候我们才应该做出重构
> * 重构：委托取代子类、委托取代超类

### 注释 （Comments）
> * 描述：这里提到注释并非是说注释是一种坏味道，只是有一些人经常将注释当作“除臭剂”来使用（一段很长的代码+一个很长的注释，来帮助解释）。往往遇到这种情况，就意味着：我们需要重构了
> * 重构：提炼函数、改变函数声明、引入断言

## 构筑测试体系
### 自测试代码的价值
如果你认真观察大多数程序员他们所花费在编写代码上的时间是很少的，花费在调试上的时间是最多的。  
1. 确保所有测试都完全自动化，让它们检查自己的测试结果。
2. 一套测试就是一个强大点bug侦测器，能够大大缩减查找bug所需的时间。
3. 撰写测试代码的最好时机是在开始动手编码之前。这种先写测试的习惯提炼成一门技艺 -- 测试驱动开发（Test-DrivenDevelopment，TDD）

### 待测试的示例代码

行省 province 生产计划 
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

看代码 chapter4/src/test.js

## 重构名录
### 重构的记录格式
1. 首先是 名称。建造一个重构词汇表，名称是很重要的。
2. 名称之后是一个简单的速写（sketch）。
3. 动机（motivation） 为你介绍“为什么需要做这个重构” 和 “什么情况下不该做这个重构”
4. 做法（mechanics）简明扼要地一步一步介绍如何进行重构。
5. 范例（examples）以一个十分简单的例子说明重构手法如何运作。

## 第一组重构
### 提炼函数（Extract Function）
名称：提炼函数（extract Function） 
反向重构：内联函数
* 动机：将意图与实现分开
 如果你需要花时间浏览一段代码才能弄清它到底在干什么，此时就要将其提炼到一个函数中。
 写非常小的函数。命名要凸显函数功能
 * 做法：
 > 1. 创建一个新函数，根据这个函数的意图来对它命名（这个函数做了什么？）
 > 2. 将待提炼的代码从源函数复制到目标函数中。
 > 3. 检查提炼出的代码，查看是否有引用访问不到的变量。若有则以参数形式传递给新函数。
 > 4. 所有变量都处理完，编译
 > 5. 在源函数中，将被提炼代码替换为目标函数的调用。
 > 6. 测试
 > 7. 查看其他代码是否有于被提炼代码的类似处。如果有，考虑使用以函数调用取代内联代码（222）令其调用新函数。

需提炼的函数
```
function pringOving(invoice) {
    let outstanding = 0;
    
    for(const o of invoice.orders) {
        outstanding += o.amount 
    }

    const today = Clock.today;
    invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

    console.log(`name: ${invoice.customer}`);
    console.log(`amount: ${outstanding}`);
    console.log(`due: ${invoice.dueDate.toLocaleDateString}`);
}
```
 举个例子：有局部变量引用的提炼函数
 ```
 function pringOwing(invoice){
    let outstanding = 0;
    
    for(const o of invoice.orders) {
        outstanding += o.amount 
    }

    
    recordDueDate(invoice);
    printDetails(invoice,outstanding);
 }

 // （只是读取变量的值，并没有改变变量的值）
 function printDetails(invoice,outstanding){
     console.log(`name: ${invoice.customer}`)
     console.log(`amount: ${outstanding}`)
 }

 // 局部变量是一个数据结构（数组，对象），而提炼代码修改了这个结构中的数据
 function recordDueDate(invoice){
    const today = Clock.today;
    invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30); 
 }
 ```

 举个例子：对局部变量再赋值
 ```
 function pringOwing(invoice){
    const outstanding = calculateOutstanding(invoice);
    
    recordDueDate(invoice);
    printDetails(invoice,outstanding);
 }

function calculateOutstanding(invoice){
    let result = 0;
    for (const o of invoice.orders){
        result += o.amount;
    }
    return result;
}
 ```

### 内联函数（Inline Function）
曾用名：内联函数（Inline Method）
反向重构：提炼函数（106）
* 动机
    1. 某些函数，其内部代码和函数名称一样清晰易读。此时应该去掉该数，直接使用其中代码。(范例一)
    2. 手上有一群组织不合理的函数。可以将他们都内联到一个大函数中，再以我喜欢的方式提炼出小函数。
* 做法
 > 1. 检查函数，确定它不具有多态性（该函数所在的类不具有继承关系）
 > 2. 找出这个函数的所有调用点
 > 3. 将这个函数的所有调用点都替换为函数本体
 > 4. 每次替换后，执行测试。
 > 5. 删除该函数的定义
 > 6. 测试
 
需提炼的函数(一)
```
function rating(aDriver) {
    return moreThanFiveLateDeliveries(aDrive) ? 2 : 1;
}
function moreThanFiveLateDeliveries(aDriver) {
    return aDriver.numberOfLateDeliveries > 5;
}

// 提炼后代码
function rating(aDriver) {
    return (aDriver.numberOfLateDeliveries > 5) ? 2 : 1;
}

```

需提炼的函数(二)
```
function reportLines(aCustomer) {
    const lines = [];
    gatherCustomerData(lines,aCustomer);
    return lines;
}
function gatherCustomer(out,aCustomer){
    out.push(["name", aCustomer.name])
    out.push(["location", aCustomer.location])
}

// 提炼后代码
function reportLines(aCustomer) {
    const lines = [];
    lines.push(["name", aCustomer.name])
    lines.push(["location", aCustomer.location])
    return lines;
}
```

### 提炼变量（Extract Variable）
曾用名：引入解释性变量（Introduce Explaining Variable）  
反向重构：内联变量

* 动机
    1. 表达式非常复杂而难以阅读的情况。
* 做法
    1. 确认要提炼的表达式没有副作用
    2. 声明一个不可修改的变量，把你想要提炼的表达式复制一份，以该表达式的结果值给这个变量赋值
    3. 用这个新变量取代原来的表达式
    4. 测试

需提炼的函数(一)
```
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get quantity() {
        return this._data.quantity;
    }

    get itemPrice() {
        return this._data.itemPrice;
    }

    get price() {
        return this.quantity * this.itemPrice - 
        Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 +
        Math.min(this.quantity * this.itemPice * 0.1, 100);
    }

}

// 提炼后代码
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get quantity() {
        return this._data.quantity;
    }

    get itemPrice() {
        return this._data.itemPrice;
    }

    get price() {
        return this.basePrice - 
        this.quantityDiscount +
        this.shipping;
    }

    get basePrice() {
        return this.quantity * this.itemPrice;
    }

    get quantityDiscount() {
        return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;
    }

    get shipping() {
        return Math.min(this.quantity * this.itemPice * 0.1, 100);
    }

}

```

### 内联变量（Inline Variable）
曾用名：内联临时变量（Inline temp）
反向重构：提炼变量
```
let basePrice = anOrder.basePrice;
return (basePrice > 1000)

// 内联
return anOrder.basePrice > 1000;
```
* 动机： 当变量不能给表达式提供有意义的名字时 或 这个名字并不必表达式本身更具表现力
* 做法：
    1. 检查确认变量赋值语句的右侧表达式没有副作用
    2. 如果变量没有被声明为不可修改，先将其变为不可修改，并执行测试。
    3. 测试
    4. 重复前面两步，逐一替换其他所有使用该变量的地方。
    删除该变量的声明点和赋值语句。
    5. 测试

### 改变函数声明（Change Function Declaration）
别名：函数改名 （Rename Function）
曾用名：函数改名（Rename Method）
曾用名：添加参数（Add Parameter）
曾用名：已出参数（Remove Parameter）
曾用名：修改签名（Change Signature）

* 动机
    1. 当看一个函数的名称无法搞清楚其中到底在干什么时，此时就应该改变

* 做法 - 简单做法
    1. 如果想要移除一个参数，需要先确定函数体内也没有使用该参数
    2. 修改函数声明，使其称为你期望的状态。
    3. 找出所有使用旧函数声明的地方，将它们改为新函数声明。
    4. 测试
* 做法 - 迁移式做法
    1. 如果有必要的话，先对函数体内部加以重构，使后面的提炼步骤易于开展。
    2. 使用提炼函数将函数体提炼成一个新函数
    3. 如果提炼出来的函数需要新增参数，用前面的简单做法添加即可。
    4. 测试。
    5. 对旧函数使用内联函数
    6. 如果新函数使用了临时的名字，再次使用改变函数声明将其改回原来的名字。
    7. 测试

```
// 添加参数
class Book {
    addReservation(customer) {
        this._reservations.push(customer);
    }

    // 提炼函数 和 内联函数
    addReservation(customer) {
      this.zz_addReservation(customer);
    }

    zz_addReservation(customer) {
        this._reservations.push(customer);
    }

}

// 重构后
class Book {
    
    // 提炼函数 和 内联函数
    addReservation(customer) {
      this.zz_addReservation(customer, false);
    }

    zz_addReservation(customer,isPriority) {
        assert(isPriority === true || isPriotity === false);
        this._reservations.push(customer);
    }

}


// 范例：把参数改为属性
function inNewEngland(aCustomer) {
    return ["MA","CT","ME","VT","NH","RI"].includes(aCustomer.address.state);
}
//调用方
const newEnglanders = someCustomers.filter(c => inNewEnglan(c));

重构：提炼变量
function inNewEngland(aCustomer) {
    const stateCode = aCustomer.address.state
    return ["MA","CT","ME","VT","NH","RI"].includes(stateCode);
}
重构：提炼函数
function inNewEngland(aCustomer) {
    const stateCode = aCustomer.address.state
    return xxNEWinNewEngland(stateCode);
}

function xxNEWinNewEngland(stateCode) {
    return ["MA","CT","ME","VT","NH","RI"].includes(stateCode);
}

//重构：内联变量
function inNewEngland(aCustomer){
    return xxNEWinNewEngland(aCustomer.address.state)
}

//调用方
const newEnglanders = someCustomers.filter(c => xxNEWinNewEngland(c.address.state));


function inNewEngland(stateCode) {
    return ["MA","CT","ME","VT","NH","RI"].includes(stateCode);
}
const newEnglanders = someCustomers.filter(c => inNewEngland(c.address.state));
```