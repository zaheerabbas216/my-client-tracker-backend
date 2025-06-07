import db from "../db/db.js";

export const getAllTasks = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM tasks`);
        return res.json({ status: 200, result: rows });
    } catch (error) {
        return res.json({ status: 500, error: "Failed to fetch the tasks!" });
    }
};

export const createTask = async (req, res) => {
    // Need to add the validation for the same data is added to the table 
    try {
        const { date, clientName, clientTask, clienttaskdetails, clienttaskstatus } = req.body;

        if (!date || !clientName || !clientTask || !clienttaskdetails || !clienttaskstatus) {
            return res.json({ status: 400, message: "Please enter the correct task details and check with all the fields" })
        }

        // to validate for the same task 
        const [existingTask] = await db.query(`SELECT * FROM tasks WHERE clientName = ? AND clientTask = ? AND clienttaskdetails =? AND clienttaskstatus = ?`, [clientName, clientTask, clienttaskdetails, clienttaskstatus]);

        if (existingTask.length > 0) {
            return res.json({ status: 400, message: "Task alreday exists!" });
        }

        const [result] = await db.query(`INSERT INTO tasks (date, clientName, clientTask, clienttaskdetails, clienttaskstatus) VALUES (?, ?, ?, ?, ?)`, [date, clientName, clientTask, clienttaskdetails, clienttaskstatus]);
        return res.json({ status: 200, message: "OK", result: req.body });

    } catch (error) {
        return res.json({ status: 500, error: error });
    }
}

// Need to create the functions for the edit delete 
export const deleteTask = async (req, res) => {
    try {
        const id = req.params;
        let deletionId = id?.id;
        let deleteQuery = `DELETE FROM tasks WHERE id = ${deletionId}`;

        let [getTaskResult] = await db.query(`SELECT * FROM tasks WHERE id = ?`, deletionId);
        if (getTaskResult.length === 0) {
            return res.json({ status: 400, message: "Id not found!" });
        }

        const [results] = await db.query(deleteQuery);
        return res.json({ status: 200, message: "Deleted Successfully" })


    } catch (error) {
        return res.json({ status: 500, error: error })
    }
}

export const editTask = async (req, res) => {
    try {
        const editId = req.params.id;
        const { date, clientName, clientTask, clienttaskdetails, clienttaskstatus } = req.body;

        if (!date || !clientName || !clientTask || !clienttaskdetails || !clienttaskstatus) {
            return res.json({ status: 400, message: "Please provide all the required fields" });
        }

        const [existingTaskRows] = await db.query("SELECT * FROM tasks WHERE id = ?", [editId]);

        if (existingTaskRows.length === 0) {
            return res.json({ status: 404, message: "Task not found" });
        }

        const existing = existingTaskRows[0];
        console.log("🚀 ~ editTask ~ existing:", existing);
        console.log("------------from body --------------------");
        console.log({ date, clientName, clientTask, clienttaskdetails, clienttaskstatus });



        const isSame =
            existing.clientName === clientName &&
            existing.clientTask === clientTask &&
            existing.clienttaskdetails === clienttaskdetails &&
            existing.clienttaskstatus === clienttaskstatus;

        if (isSame) {
            console.log("🚀 ~ editTask ~ isSame:", isSame)
            return res.json({
                status: 400,
                message: "Same data already exists. No changes detected.",
            });
        }
        console.log("🚀 ~ editTask ~ isSame:", isSame)
        // Proceed with update
        const [result] = await db.query(
            `UPDATE tasks 
       SET date = ?, clientName = ?, clientTask = ?, clienttaskdetails = ?, clienttaskstatus = ? 
       WHERE id = ?`,
            [date, clientName, clientTask, clienttaskdetails, clienttaskstatus, editId]
        );

        return res.json({ status: 200, message: "Task Edited Successfully!" });

    } catch (error) {
        console.error("Edit error:", error);
        return res.json({ status: 500, error });
    }
};



