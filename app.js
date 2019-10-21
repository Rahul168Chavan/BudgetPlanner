var budgetController = (function () {
    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };
    var calculateTotalValue = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expenses(ID, des, val);
            }
            else if (type = 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function (type, id) {
            var index, ids;
            ids = data.allItems[type].map(function (cur) {
                return cur.id;
            })
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            calculateTotalValue('inc');
            calculateTotalValue('exp');
            data.budget = data.totals.inc - data.totals.exp;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },
        testing: function () {
            console.log(data);
        }

    };
})();


var UIController = (function () {
    var DOMString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        proceedBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        totalExpenses: '.budget__expenses--value',
        totalIncome: '.budget__income--value',
        container: '.container'
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseInt(document.querySelector(DOMString.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMString.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMString.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">               <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (selectorId) {
            var itemIds = document.getElementById(selectorId);
            itemIds.parentNode.removeChild(itemIds);
        },
        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMString.inputDescription + ',' + DOMString.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (cur) {
                cur.value = '';
            });
            fieldsArray[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMString.totalIncome).textContent = obj.totalInc;
            document.querySelector(DOMString.totalExpenses).textContent = obj.totalExp;
        },
        getDOMString: function () {
            return DOMString;

        }
    };

})();



var controller = (function (bdgtcntlr, uicntlr) {
    var setupEventListener = function () {
        var DOM = uicntlr.getDOMString();
        document.querySelector(DOM.proceedBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
        //1.calculate the budget
        bdgtcntlr.calculateBudget();
        //2.update the budget
        var budget = bdgtcntlr.getBudget();
        //3.display the budget
        uicntlr.displayBudget(budget);


    }
    var ctrlAddItem = function () {
        var input, newItem;
        input = uicntlr.getInput();
        if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {
            newItem = bdgtcntlr.addItem(input.type, input.description, input.value);
            uicntlr.addListItem(newItem, input.type);
            uicntlr.clearFields();
            updateBudget();
        }
        if (input.description === "") {
            alert("Please enter the Description.");
        }
        else if (input.value === 0 || isNaN(input.value)) {
            alert("Please give a proper number greater then 0.")
        }
    };
    var ctrlDeleteItem = function (event) {
        var itemId, id, type, plitId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitId = itemId.split('-');
        id = parseInt(splitId[1]);
        type = splitId[0];
        bdgtcntlr.deleteItem(type, id);
        uicntlr.deleteListItem(itemId);
        updateBudget();
    }
    return {
        init: function () {
            console.log("application started");
            setupEventListener();
        }
    }
})(budgetController, UIController);
controller.init();
