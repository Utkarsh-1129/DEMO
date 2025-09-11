import mongoose from "mongoose";

const AgriSchema = new mongoose.Schema(
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
		email: {
			type: String,
			required: true,
			unique: true,
		},
		licenseNumber: {
			type: String,
			required: true,
			unique: true,
		},
		aadhar: {
			type: String,
			required: true,
			unique: true,
		},
		tasks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Tasks",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Agri = mongoose.model("Agri", AgriSchema);
export default Agri;
