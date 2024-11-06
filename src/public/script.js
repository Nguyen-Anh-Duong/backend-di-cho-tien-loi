let count = 0;
document.getElementById("incrementBtn").addEventListener("click", function () {
  count++;
  document.getElementById("countValue").textContent = count;
});
