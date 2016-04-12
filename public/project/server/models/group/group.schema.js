module.exports = function(mongoose) {
  
    var ensureOneAdmin = ensureOneAdmin;

    var GroupSchema = mongoose.Schema({
        name: { type: String, required: true },
        admins: { type: [mongoose.Schema.ObjectId], validate: ensureOneAdmin },
        members: { type: [mongoose.Schema.ObjectId], default: [] },
        visibility: { type: String, enum: [ 'PUBLIC', 'PRIVATE' ] }
    }, { collection: 'project.group' });

    return mongoose.model('Group', GroupSchema);

    ////////////////////////////////////
    

    function ensureOneAdmin(admins) {
        return admins && admins.length > 0;
    }
    
}
