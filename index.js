const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON body

// HTML-rendered user list
app.get("/users", (req, res) => {
    const html = `
        <html>
            <head><title>User List</title></head>
            <body>
                <style>
                    ul { list-style: none; padding: 0; font-family: Arial, sans-serif; }
                    li { background: #f9f9f9; margin: 10px 0; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .user-id { font-weight: bold; color: #333; }
                    .user-name { font-size: 1.1em; color: #007bff; margin-top: 5px; }
                    .job-title { font-style: italic; color: #555; }
                </style>
                <ul>
                    ${users.map(user => `
                        <li>
                            <div class="user-id">ID: ${user.id}</div>
                            <div class="user-name">Name: ${user.first_name} ${user.last_name}</div>
                            <div class="job-title">Job Title: ${user.job_title}</div>
                        </li>
                    `).join("")}
                </ul>
            </body>
        </html>
    `;
    res.send(html);
});

// GET all users
app.get("/api/users", (req, res) => {
    res.json(users);
});

// GET a single user by ID
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// POST a new user
app.post("/api/users", (req, res) => {
    const body = req.body;
    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ error: "Failed to write file" });
        res.status(201).json({ status: "User added", user: newUser });
    });
});

// PATCH a user
app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    console.log(userIndex);s
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    users[userIndex] = { ...users[userIndex], ...req.body }
    console.log(users.first_name)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ error: "Failed to update file" });
        res.json({ status: "User updated", user: users[userIndex] });
    });
});

// DELETE a user
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    const deletedUser = users.splice(userIndex, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ error: "Failed to delete user" });
        res.json({ status: "User deleted", user: deletedUser[0] });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
