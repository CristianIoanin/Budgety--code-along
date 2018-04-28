// BUDGET CONTROLLER
const budgetController = (function() {

    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round( (this.value / totalIncome) * 100 );
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else ID = 1;

            // Create new item basen on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense (ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push newly created item into the data structure
            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id) {
            let ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {

            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // Calculate the budget = income - expenses
            data.budget = Math.round(data.totals.inc - data.totals.exp);
            // Calculate the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            let allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });

            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();

const setOrReadLang = function() {
    let language;
    if (localStorage.getItem('budgety__lang')) {
        language = localStorage.getItem('budgety__lang');
    } else language = 'EN';

    return language;
};
window.addEventListener('load', setOrReadLang);


// LANGUAGE Controller
const languageController = (function(language) {

    const UILanguage = function(language) {

        const textElements = {
            title: document.querySelector('.budget__title'),
            income: document.querySelector('.budget__income--text'),
            expenses: document.querySelector('.budget__expenses--text'),
            description: document.querySelector('.add__description'),
            value: document.querySelector('.add__value'),
            incomeList: document.querySelector('.icome__title'),
            expensesList: document.querySelector('.expenses__title'),
            history: document.querySelector('.history__title')
        };

        const textbyLanguage = function(lang) {
            textElements.title.textContent = lang === 'EN' ? 'Available Budget in ' : 'Buget disponibil în ';
            textElements.title.insertAdjacentHTML('beforeend', '<span class="budget__title--month">%Month%</span>');
            textElements.income.textContent = lang === 'EN' ? 'INCOME' : 'VENITURI';
            textElements.expenses.textContent = lang === 'EN' ? 'EXPENSES' : 'CHELTUIELI';
            textElements.description.setAttribute('placeholder', lang === 'EN' ? 'Add description' : 'Adaugă o descriere');
            textElements.value.setAttribute('placeholder', lang === 'EN' ? 'Value' : 'Sumă');
            textElements.incomeList.textContent = lang === 'EN' ? 'INCOME' : 'VENITURI';
            textElements.expensesList.textContent = lang === 'EN' ? 'EXPENSES' : 'CHELTUIELI';
            textElements.history.textContent = lang === 'EN' ? 'HISTORY' : 'ISTORIC';
        };
        textbyLanguage(language);

        let months = language === 'EN' ?
        ['January','February','March','April','May','June','July','August','September','October','November','December'] :
        ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];

        const displayMonth = function(monthsArray) {
            let now, year, month, language;

            now = new Date();
            year = now.getFullYear();

            month = now.getMonth();
            document.querySelector('.budget__title--month').textContent = `${monthsArray[month]} ${year}`;

            const getPastMonth = function(monthsArray, month, past) {
                let pastMonth = -1;
                if ((month - past) >= 0) {
                    pastMonth = month - past;
                } else {
                    pastMonth = monthsArray.length - Math.abs(month - past);
                }
                return pastMonth;
            };

            document.getElementById('month-5').textContent = `${monthsArray[getPastMonth(months, month, 5)]}`;
            document.getElementById('month-4').textContent = `${monthsArray[getPastMonth(months, month, 4)]}`;
            document.getElementById('month-3').textContent = `${monthsArray[getPastMonth(months, month, 3)]}`;
            document.getElementById('month-2').textContent = `${monthsArray[getPastMonth(months, month, 2)]}`;
            document.getElementById('month-1').textContent = `${monthsArray[getPastMonth(months, month, 1)]}`;
        };
        displayMonth(months);
    };
    UILanguage(language);

    const lang_setting = function(event) {
        if (event.target.matches('.EN')) language = 'EN';
        else if (event.target.matches('.RO')) language = 'RO';
        localStorage.setItem('budgety__lang', language);
        return language;
    };

    const languageSelector = document.querySelector('.language').addEventListener('click', e => UILanguage(lang_setting(e)));
})(setOrReadLang());

// UI CONTROLLER
const UIController = (function() {

    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
    };

    const formatNumber = function(num, type) {
        let numSplit, integer, decimal;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        integer = numSplit[0];
        if (integer.length > 3) {
            integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
        }
        decimal = numSplit[1];

        return `${type === 'exp' ? '-' : '+'} ${integer}.${decimal}`;
    };

    const nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // Will get either 'inc' or'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            let html, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = 
                `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = 
                `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function(selectorID) {
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        clearFields: function() {
            let fields, filedsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
        
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            let type = obj.budget > 0 ? 'inc' : 'exp';

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = `--%`;
            }
        },

        displayPercentages: function(percentages) {
            let fields;

            fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = `${percentages[index]}%`;
                } else {
                    current.textContent = '--%';
                }
            });
        },

        changedType: function() {
            let fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();


// GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    const updateBudget = function() {
        // 1. Calculate the budget
        budgetController.calculateBudget();

        // 2. Method to return the budget
        const budget = budgetController.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    const updatePercentages = function() {
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    const ctrlAddItem = function() {
        let input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if ( input.description !== '' && !isNaN(input.value) && input.value > 0 ) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the input fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    const ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        // 1. Delete the item from the data structure
        budgetController.deleteItem(type, ID);

        // 2. Delete the item from the user interface
        UIController.deleteListItem(itemID);

        // 3. Update and show the new budget
        updateBudget();

        // 4. Calculate and update percentages
        updatePercentages();
    };

    return {
        init: function() {
            // UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();