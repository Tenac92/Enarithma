const express = require("express");
const router = express.Router();
const db = require("./db.js");

// Get all users
router.get("/", async (req, res) => {
  try {
    const { data, error } = await db.supabase.from('users').select("*");

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

// Add a new user
router.post("/", async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming request data

  const { name, email, role } = req.body;

  // Validate input data
  if (!name || !email || !role) {
    return res.status(400).send("Name, email, and role are required.");
  }

  try {
    // Insert the user into the database
    const { data, error } = await db.supabase
      .from('users')
      .insert([{ name, email, role }]);

    if (error) {
      console.error("Error inserting user:", error); // Log the error from Supabase
      return res
        .status(500)
        .json({
          message: "Error inserting user into database",
          error: error.message,
        });
    }

    console.log("User added successfully:", data);
    res.status(201).json(data); // Return the inserted user data with a 201 status code
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Server error");
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("User ID is required.");
  }

  try {
    // Delete the user from the database
    const { data, error } = await db.supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      return res
        .status(500)
        .json({ message: "Error deleting user from database" });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User deleted successfully:", data);
    res.json(data);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
