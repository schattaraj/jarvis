function formatAmount(amount) {
  if (amount === "") {
    return "";
}

    // Convert amount to number if it's not already
    amount = parseFloat(amount);
  
    // Check if the amount is a valid number
    if (isNaN(amount)) {
      return "Invalid Amount";
    }
  
    // Format the amount with commas and dollar sign
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
  export default formatAmount;