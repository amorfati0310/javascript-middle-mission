var readline = require("./config/readline")();

function VendingMachine() {
	this.drinks = new Drinks();
	this.stateList = { "WAIT_MONEY": 1, "WAIT_CHOOSE_DRINK": 3, "WAIT_CHOOSE_REFUND": 4, "FINISHED": 5 }
	this.state = this.stateList.WAIT_MONEY;
	this.fund = 0;

	this.getBuyableDrinkList = function (money) {
		var drinkList = [];
		this.drinks.drinkList.forEach(function (drink) {
			if (drink.price <= money) {
				drinkList.push(drink);
			}
		});
		return drinkList;
	}
	this.getNamedDrink = function (drinkName) {
		var NamedDrink = '';
		this.drinks.drinkList.forEach(function (drink) {
			if (drink.name === drinkName) {
				NamedDrink = drink;
			}
		});
		return NamedDrink;
	}
	this.buyDrink = function (name) {
		var price = this.drinks.getDrinkPrice(name);
		this.fund -= price;
		this.drinks.takeOutDrink(name);
	}
	this.deposit = function (fund) {
		this.fund = fund;
	}
	this.refund = function () {
		tmp = this.fund;
		this.fund = 0;
		return tmp;
	}
}

function Drinks() {
	this.drinkList = [];
	this.addDrink = function (name, price, amount) {
		var drink = new Drink(name, price, amount);
		this.drinkList.push(drink);
	}
	this.getDrinkPrice = function (drinkName) {
		var price = 0;
		this.drinkList.forEach(function (drink) {
			if (drink.name === drinkName)
				price = drink.price;
		});
		return price;
	}
	this.takeOutDrink = function (drinkName) {
		this.drinkList.forEach(function (drink) {
			if (drink.name === drinkName)
				drink.amount--;
		});
	}
}

function Drink(name, price, amount) {
	this.name = name;
	this.price = price;
	this.amount = amount;
}

machine = makeMachine();
showInsertCoin(); //동전을 넣으세요
readline.prompt(); // >
waitCommand(machine);

function makeMachine() {
	machine = new VendingMachine();
	machine.drinks.addDrink("콜라", 1000, 1);
	machine.drinks.addDrink("사이다", 1000, 1);
	machine.drinks.addDrink("포도쥬스", 700, 1);
	machine.drinks.addDrink("딸기우유", 500, 1);
	machine.drinks.addDrink("미에로화이바", 900, 1);
	machine.drinks.addDrink("물", 500, 1);
	machine.drinks.addDrink("파워에이드", 1000, 0);
	return machine;
}

function waitCommand(machine) {
	readline.on("line", function (line) {

		commandToMachine(machine, line);
		if (machine.state == machine.stateList.FINISHED) {
			readline.close();
		} else {
			readline.prompt();
		}
	});
}

function commandToMachine(machine, command) {
	switch (machine.state) {
		case machine.stateList.WAIT_MONEY:
			commandWaitMoney(machine, command);
			break;
		case machine.stateList.WAIT_CHOOSE_DRINK:
			commandChooseDrink(machine, command);
			break;
		case machine.stateList.WAIT_CHOOSE_REFUND:
			commandChooseRefund(machine, command);
			break;
		default:
			showMachineOffed();
			break;
	}
}

function commandWaitMoney(machine, command) {
	money = parseInt(command);
	if (typeof money !== "number" || isNaN(money)) {
		showInsertCoin();
		return;
	}
	machine.deposit(money);
	buyableDrinks = machine.getBuyableDrinkList(machine.fund);
	if (isEmpty(buyableDrinks)) {
		showCanBuyNothing();
		showInsertCoin();
		return;
	}
	showBuyAbleDrinks(machine);
	showPleaseChoose();
	machine.state = machine.stateList.WAIT_CHOOSE_DRINK;
}

function commandChooseDrink(machine, command) {
	var drinkName = command;
	drink = machine.getNamedDrink(drinkName);
	if (isEmpty(drink)) {
		showItsNothing();
		showBuyAbleDrinks(machine);
		showPleaseChoose();
		return;
	}
	if (drink.amount === 0) {
		showItsRanOut();
		showBuyAbleDrinks(machine);
		showPleaseChoose();
		return;
	}
	machine.buyDrink(drinkName);
	showDrinkCome(drink);
	showBuyAbleDrinks(machine);
	showBuyOrRefund();
	machine.state = machine.stateList.WAIT_CHOOSE_REFUND;
}

function commandChooseRefund(machine, command) {
	if (command === "반환") {
		showTheChange(machine.fund);
		machine.state = machine.stateList.FINISHED;
		return;
	}

	money = parseInt(command);
	if (typeof money === "number" && !isNaN(money)) {
		machine.state = machine.stateList.WAIT_MONEY;
		commandWaitMoney(machine, command);
		return;
	}

	showBuyOrRefund();
}

function showBuyAbleDrinks(machine) {
	var list = machine.getBuyableDrinkList(machine.fund);
	if (isEmpty(list)) {
		console.log("사용 가능한 음료수 : 없음");
	}
	showDrinks(list);
}

function showDrinks(drinks) {
	//콜라(1000), 사이다(1000), 포도쥬스(700), 딸기우유(500), 미에로화이바(900), 물(500), 파워에이드(재고없음)
	var drinksText = [];
	drinks.forEach(function (drink) {
		if (showText != "") {
			showText += ", ";
		}
		if (drink.amount != 0) {
			showText += drink.name + "(" + drink.price + ")";
		}
		else {
			showText += drink.name + "(재고없음)";
		}
	});
	showText = "사용 가능한 음료수 : " + drinksText;
	console.log(showText);
}

function showInsertCoin() {
	console.log("동전을 넣으세요.");
}

function showCanBuyNothing() {
	console.log("아무것도 못 삽니다.");
}

function showMachineOffed() {
	console.log('자판기가 꺼져 있습니다.');
}

function showPleaseChoose() {
	console.log('선택하세요.');
}

function showItsNothing() {
	console.log('그런 건 없습니다.');
}

function showItsRanOut() {
	console.log('그거 다 떨어졌어요.');
}

function showDrinkCome(drink) {
	console.log(drink.name + '가 나왔습니다.');
}

function showBuyOrRefund() {
	console.log('다른걸 구매할까요? 반환할까요?');
}

function showTheChange(money) {
	console.log('잔액은 ' + money + '원입니다.');
}

// [], {} 도 빈값으로 처리
var isEmpty = function (value) {
	if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
		return true;
	} else {
		return false;
	}
};
