const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildIcon: { type: String, required: false },
    userId: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
});

module.exports = model("Guild", guildSchema, "xps");