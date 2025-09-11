import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Chats",
			},
		],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", UserSchema);
export default User;
