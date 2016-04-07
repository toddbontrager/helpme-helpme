var GoalSchema = new mongoose.Schema({
  goal: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
  //TO DO post: [ PostSchema ]
});

module.exports = mongoose.model('Goal', GoalSchema);