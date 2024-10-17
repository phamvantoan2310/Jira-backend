const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        description: {type: String},
        status: {type: String, enum: ['In-Progress', 'Not-Started', 'Complete'], require: true},
        start_date: {type: String, require: true},
        due_date: {type: String, require: true},
        instruction_file: {type: String},
        manager: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        
        users: [{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;