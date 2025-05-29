const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

/**
 * Route: GET /users
 * Description: Renders a styled HTML list of users
 */
app.get("/users", (req, res) => {
    const html = `
        <html>
            <head>
                <title>User List</title>
                <style>
                    ul {
                        list-style: none;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                    li {
                        background-color: #f9f9f9;
                        margin: 10px 0;
                        padding: 15px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .user-id {
                        font-weight: bold;
                        color: #333;
                    }
                    .user-name {
                        font-size: 1.1em;
                        color: #007bff;
                    }
                    .job-title {
                        font-style: italic;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <h2>User List</h2>
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

/**
 * Route: GET /api/users
 * Description: Returns all users as JSON
 */
app.get("/api/users", (req, res) => {
    res.json(users);
});

/**
 * Route: /api/users/:id
 * Methods: GET, POST, PATCH, DELETE
 * Description: Dynamic user operations
 */
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    })
    .post((req, res) => {
        res.json({ status: "POST to specific user pending" });
    })
    .patch((req, res) => {
        res.json({ status: "PATCH user pending" });
    })
    .delete((req, res) => {
        res.json({ status: "DELETE user pending" });
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Server initiated on port ${PORT}`);
});
