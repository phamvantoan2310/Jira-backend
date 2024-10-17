const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        description: { type: String },
        status: { type: String, enum: ['In-Progress', 'Not-Started', 'Complete'], require: true },
        start_date: { type: String, require: true },
        due_date: { type: String, require: true },
        instruction_file: { type: String },
        response_file: { type: String },
        manager: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        assigned_to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;