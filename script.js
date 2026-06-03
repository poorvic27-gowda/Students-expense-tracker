let expenses = [];

let chart;

/* LOAD DATA */

window.onload = () => {

    expenses =
        JSON.parse(
            localStorage.getItem(
                "expenses"
            )
        ) || [];

    document.getElementById(
        "income"
    ).value =
        localStorage.getItem(
            "income"
        ) || "";

    document.getElementById(
        "budget"
    ).value =
        localStorage.getItem(
            "budget"
        ) || "";

    renderExpenses();

    updateSummary();

    createChart();
};

/* SAVE INCOME */

function saveIncome() {

    localStorage.setItem(
        "income",
        document.getElementById(
            "income"
        ).value
    );

    updateSummary();
}

/* SAVE BUDGET */

function saveBudget() {

    localStorage.setItem(
        "budget",
        document.getElementById(
            "budget"
        ).value
    );

    updateSummary();
}

/* ADD EXPENSE */

function addExpense() {

    const name =
        document.getElementById(
            "expenseName"
        ).value.trim();

    const amount =
        Number(
            document.getElementById(
                "expenseAmount"
            ).value
        );

    const date =
        document.getElementById(
            "expenseDate"
        ).value;

    const category =
        document.getElementById(
            "expenseCategory"
        ).value;

    if (
        !name ||
        !amount ||
        !date
    ) {

        alert(
            "Please fill all fields"
        );

        return;
    }

    expenses.push({

        id: Date.now(),

        name,

        amount,

        date,

        category

    });

    saveExpenses();

    document.getElementById(
        "expenseName"
    ).value = "";

    document.getElementById(
        "expenseAmount"
    ).value = "";

    document.getElementById(
        "expenseDate"
    ).value = "";

    renderExpenses();

    updateSummary();

    updateChart();
}

/* SAVE EXPENSES */

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(
            expenses
        )
    );
}

/* RENDER LIST */

function renderExpenses(
    list = expenses
) {

    const ul =
        document.getElementById(
            "expenseList"
        );

    ul.innerHTML = "";

    list.forEach(expense => {

        const li =
            document.createElement(
                "li"
            );

        li.innerHTML = `

        <div>

            <strong>
            ${expense.name}
            </strong>

            <br>

            ₹${expense.amount}

            |

            ${expense.category}

            <br>

            ${expense.date}

        </div>

        <div class="action-buttons">

            <button
            class="edit-btn"
            onclick="editExpense(${expense.id})">

            Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteExpense(${expense.id})">

            Delete

            </button>

        </div>

        `;

        ul.appendChild(li);
    });
}

/* EDIT */

function editExpense(id) {

    const expense =
        expenses.find(
            e => e.id === id
        );

    const newAmount =
        prompt(
            "Enter Amount",
            expense.amount
        );

    if (
        newAmount === null
    ) return;

    expense.amount =
        Number(
            newAmount
        );

    saveExpenses();

    renderExpenses();

    updateSummary();

    updateChart();
}

/* DELETE */

function deleteExpense(id) {

    expenses =
        expenses.filter(
            e => e.id !== id
        );

    saveExpenses();

    renderExpenses();

    updateSummary();

    updateChart();
}

/* SUMMARY */

function updateSummary() {

    const income =
        Number(
            document.getElementById(
                "income"
            ).value
        ) || 0;

    const budget =
        Number(
            document.getElementById(
                "budget"
            ).value
        ) || 0;

    const totalExpense =
        expenses.reduce(

            (sum, expense) =>

            sum +
            expense.amount,

            0
        );

    const balance =
        income -
        totalExpense;

    document.getElementById(
        "totalExpense"
    ).innerText =
        "₹" +
        totalExpense;

    document.getElementById(
        "balance"
    ).innerText =
        "₹" +
        balance;

    document.getElementById(
        "budgetStatus"
    ).innerText =

        budget > 0 &&
        totalExpense > budget

        ?

        "⚠ Budget Exceeded"

        :

        "Within Budget";
}

/* SEARCH */

function searchExpenses() {

    const text =

        document
        .getElementById(
            "search"
        )
        .value
        .toLowerCase();

    const filtered =

        expenses.filter(
            expense =>

            expense.name
            .toLowerCase()
            .includes(text)
        );

    renderExpenses(
        filtered
    );
}

/* FILTERS */

function filterExpenses(type) {

    const today =
        new Date();

    let filtered =
        [];

    if (
        type === "all"
    ) {

        filtered =
            expenses;
    }

    else {

        filtered =
            expenses.filter(
                expense => {

                const d =
                    new Date(
                        expense.date
                    );

                if (
                    type === "today"
                ) {

                    return (

                        d.toDateString()

                        ===

                        today.toDateString()
                    );
                }

                if (
                    type === "week"
                ) {

                    return (

                        (today - d)

                        /

                        (1000*60*60*24)

                    ) <= 7;
                }

                if (
                    type === "month"
                ) {

                    return (

                        d.getMonth()

                        ===

                        today.getMonth()

                        &&

                        d.getFullYear()

                        ===

                        today.getFullYear()
                    );
                }
            });
    }

    renderExpenses(
        filtered
    );
}

/* CHART */

function createChart() {

    chart =
        new Chart(

        document.getElementById(
            "expenseChart"
        ),

        {

            type: "pie",

            data: {

                labels: [],

                datasets: [{

                    data: [],

                    backgroundColor: [

                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#8BC34A"

                    ]
                }]
            }
        });

    updateChart();
}

function updateChart() {

    const totals = {};

    expenses.forEach(
        expense => {

            totals[
                expense.category
            ] =

                (
                    totals[
                        expense.category
                    ] || 0
                )

                +

                expense.amount;
        }
    );

    chart.data.labels =
        Object.keys(
            totals
        );

    chart.data.datasets[0].data =
        Object.values(
            totals
        );

    chart.update();
}

/* PDF */

async function downloadPDF() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    doc.text(
        "Student Expense Report",
        20,
        20
    );

    let y = 40;

    expenses.forEach(
        (
            expense,
            index
        ) => {

            doc.text(

                `${index+1}. ${expense.name} - Rs ${expense.amount}`,

                20,

                y
            );

            y += 10;
        }
    );

    doc.save(
        "Expense_Report.pdf"
    );
}

/* CLEAR */

function clearExpenses() {

    if (

        confirm(
            "Delete all expenses?"
        )

    ) {

        expenses = [];

        saveExpenses();

        renderExpenses();

        updateSummary();

        updateChart();
    }
}

/* DARK MODE */

function toggleTheme() {

    document.body
        .classList.toggle(
            "dark-mode"
        );
}let expenses = [];

let chart;

/* LOAD DATA */

window.onload = () => {

    expenses =
        JSON.parse(
            localStorage.getItem(
                "expenses"
            )
        ) || [];

    document.getElementById(
        "income"
    ).value =
        localStorage.getItem(
            "income"
        ) || "";

    document.getElementById(
        "budget"
    ).value =
        localStorage.getItem(
            "budget"
        ) || "";

    renderExpenses();

    updateSummary();

    createChart();
};

/* SAVE INCOME */

function saveIncome() {

    localStorage.setItem(
        "income",
        document.getElementById(
            "income"
        ).value
    );

    updateSummary();
}

/* SAVE BUDGET */

function saveBudget() {

    localStorage.setItem(
        "budget",
        document.getElementById(
            "budget"
        ).value
    );

    updateSummary();
}

/* ADD EXPENSE */

function addExpense() {

    const name =
        document.getElementById(
            "expenseName"
        ).value.trim();

    const amount =
        Number(
            document.getElementById(
                "expenseAmount"
            ).value
        );

    const date =
        document.getElementById(
            "expenseDate"
        ).value;

    const category =
        document.getElementById(
            "expenseCategory"
        ).value;

    if (
        !name ||
        !amount ||
        !date
    ) {

        alert(
            "Please fill all fields"
        );

        return;
    }

    expenses.push({

        id: Date.now(),

        name,

        amount,

        date,

        category

    });

    saveExpenses();

    document.getElementById(
        "expenseName"
    ).value = "";

    document.getElementById(
        "expenseAmount"
    ).value = "";

    document.getElementById(
        "expenseDate"
    ).value = "";

    renderExpenses();

    updateSummary();

    updateChart();
}

/* SAVE EXPENSES */

function saveExpenses() {

    localStorage.setItem(
        "expenses",
        JSON.stringify(
            expenses
        )
    );
}

/* RENDER LIST */

function renderExpenses(
    list = expenses
) {

    const ul =
        document.getElementById(
            "expenseList"
        );

    ul.innerHTML = "";

    list.forEach(expense => {

        const li =
            document.createElement(
                "li"
            );

        li.innerHTML = `

        <div>

            <strong>
            ${expense.name}
            </strong>

            <br>

            ₹${expense.amount}

            |

            ${expense.category}

            <br>

            ${expense.date}

        </div>

        <div class="action-buttons">

            <button
            class="edit-btn"
            onclick="editExpense(${expense.id})">

            Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteExpense(${expense.id})">

            Delete

            </button>

        </div>

        `;

        ul.appendChild(li);
    });
}

/* EDIT */

function editExpense(id) {

    const expense =
        expenses.find(
            e => e.id === id
        );

    const newAmount =
        prompt(
            "Enter Amount",
            expense.amount
        );

    if (
        newAmount === null
    ) return;

    expense.amount =
        Number(
            newAmount
        );

    saveExpenses();

    renderExpenses();

    updateSummary();

    updateChart();
}

/* DELETE */

function deleteExpense(id) {

    expenses =
        expenses.filter(
            e => e.id !== id
        );

    saveExpenses();

    renderExpenses();

    updateSummary();

    updateChart();
}

/* SUMMARY */

function updateSummary() {

    const income =
        Number(
            document.getElementById(
                "income"
            ).value
        ) || 0;

    const budget =
        Number(
            document.getElementById(
                "budget"
            ).value
        ) || 0;

    const totalExpense =
        expenses.reduce(

            (sum, expense) =>

            sum +
            expense.amount,

            0
        );

    const balance =
        income -
        totalExpense;

    document.getElementById(
        "totalExpense"
    ).innerText =
        "₹" +
        totalExpense;

    document.getElementById(
        "balance"
    ).innerText =
        "₹" +
        balance;

    document.getElementById(
        "budgetStatus"
    ).innerText =

        budget > 0 &&
        totalExpense > budget

        ?

        "⚠ Budget Exceeded"

        :

        "Within Budget";
}

/* SEARCH */

function searchExpenses() {

    const text =

        document
        .getElementById(
            "search"
        )
        .value
        .toLowerCase();

    const filtered =

        expenses.filter(
            expense =>

            expense.name
            .toLowerCase()
            .includes(text)
        );

    renderExpenses(
        filtered
    );
}

/* FILTERS */

function filterExpenses(type) {

    const today =
        new Date();

    let filtered =
        [];

    if (
        type === "all"
    ) {

        filtered =
            expenses;
    }

    else {

        filtered =
            expenses.filter(
                expense => {

                const d =
                    new Date(
                        expense.date
                    );

                if (
                    type === "today"
                ) {

                    return (

                        d.toDateString()

                        ===

                        today.toDateString()
                    );
                }

                if (
                    type === "week"
                ) {

                    return (

                        (today - d)

                        /

                        (1000*60*60*24)

                    ) <= 7;
                }

                if (
                    type === "month"
                ) {

                    return (

                        d.getMonth()

                        ===

                        today.getMonth()

                        &&

                        d.getFullYear()

                        ===

                        today.getFullYear()
                    );
                }
            });
    }

    renderExpenses(
        filtered
    );
}

/* CHART */

function createChart() {

    chart =
        new Chart(

        document.getElementById(
            "expenseChart"
        ),

        {

            type: "pie",

            data: {

                labels: [],

                datasets: [{

                    data: [],

                    backgroundColor: [

                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#8BC34A"

                    ]
                }]
            }
        });

    updateChart();
}

function updateChart() {

    const totals = {};

    expenses.forEach(
        expense => {

            totals[
                expense.category
            ] =

                (
                    totals[
                        expense.category
                    ] || 0
                )

                +

                expense.amount;
        }
    );

    chart.data.labels =
        Object.keys(
            totals
        );

    chart.data.datasets[0].data =
        Object.values(
            totals
        );

    chart.update();
}

/* PDF */

async function downloadPDF() {

    const { jsPDF } =
        window.jspdf;

    const doc =
        new jsPDF();

    doc.text(
        "Student Expense Report",
        20,
        20
    );

    let y = 40;

    expenses.forEach(
        (
            expense,
            index
        ) => {

            doc.text(

                `${index+1}. ${expense.name} - Rs ${expense.amount}`,

                20,

                y
            );

            y += 10;
        }
    );

    doc.save(
        "Expense_Report.pdf"
    );
}

/* CLEAR */

function clearExpenses() {

    if (

        confirm(
            "Delete all expenses?"
        )

    ) {

        expenses = [];

        saveExpenses();

        renderExpenses();

        updateSummary();

        updateChart();
    }
}

/* DARK MODE */

function toggleTheme() {

    document.body
        .classList.toggle(
            "dark-mode"
        );
}
