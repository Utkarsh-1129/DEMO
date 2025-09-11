import jwt from "jsonwebtoken";

export const generateAgriToken = (agri, res) => {
	const token = jwt.sign({ agri }, process.env.JWT_Agri, {
		expiresIn: "15d",
	});
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //15days
		httpOnly: true,
		// sameSite: 'strict',  //for https only
		// sameSite: 'lax',
		sameSite: "none",
		// secure: process.env.NODE_ENV !== 'development'
		secure: true,
	});
};
export const generateUserToken = (user, res) => {
	const token = jwt.sign({ user }, process.env.JWT_User, {
		expiresIn: "15d",
	});
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //15days
		httpOnly: true,
		// sameSite: 'strict',  //for https only
		// sameSite: 'lax',
		sameSite: "none",
		// secure: process.env.NODE_ENV !== 'development'
		secure: true,
	});
};
