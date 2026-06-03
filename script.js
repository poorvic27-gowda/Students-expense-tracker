let totalIncome = 0;
let totalExpense = 0;

function addTransaction() {

    let amount = parseFloat(
        document.getElementById("amount").value
    );

    let category =
        document.getElementById("category").value;

    let type =
        document.getElementById("type").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    if (type === "income") {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }

    let balance = totalIncome - totalExpense;

    document.getElementById("income").textContent =
        totalIncome;

    document.getElementById("expense").textContent =
        totalExpense;

    document.getElementById("balance").textContent =
        balance;

    let row = `
        <tr>
            <td>${category}</td>
            <td>${type}</td>
            <td>₹${amount}</td>
        </tr>
    `;

    document.getElementById("transactionList")
        .insertAdjacentHTML("beforeend", row);

    document.getElementById("amount").value = "";
}
