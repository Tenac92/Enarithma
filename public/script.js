// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch users and populate the table
  const usersTable = document
    .getElementById("usersTable")
    .getElementsByTagName("tbody")[0];

  try {
    const response = await fetch("/users"); // Assuming GET request is handled in your API
    if (response.ok) {
      const users = await response.json();

      // Clear the existing table data
      usersTable.innerHTML = "";

      // Populate the table with new data
      users.forEach((user) => {
        const row = usersTable.insertRow();
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
        `;
      });
    } else {
      console.error("Error fetching users:", response.status);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Form submission handling
document
  .getElementById("addUserForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    try {
      const response = await fetch("/users.js", {
        // Change from '/' to '/users'
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role }),
      });
      

      if (response.ok) {
        console.log("User added successfully!");
        // Re-fetch and update the table
        await fetchAndUpdateTable();
      } else {
        console.error("Error adding user:", response.status);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });

async function fetchAndUpdateTable() {
  const usersTable = document
    .getElementById("usersTable")
    .getElementsByTagName("tbody")[0];
  try {
    const response = await fetch("/users");
    if (response.ok) {
      const users = await response.json();
      // Clear current table content
      usersTable.innerHTML = "";
      // Insert new rows into the table
      users.forEach((user) => {
        const row = usersTable.insertRow();
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
        `;
      });
    }
  } catch (error) {
    console.error("Error updating the table:", error);
  }
}
