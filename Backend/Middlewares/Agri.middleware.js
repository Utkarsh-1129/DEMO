import jwt from "jsonwebtoken";
import Agri from "../Schemas/Agri.model.js";

const AgriProtectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res
				.status(401)
				.json({ error: "Unauthorised-no Token Provided" });
		}

		const decode = jwt.verify(token, process.env.JWT_Agri);

		if (!decode) {
			return res.status(401).json({ message: "Invalid Token" });
		}
		const agri = await Agri.findById(decode.agri);

		if (!agri) {
			return res.status(401).json({ message: "No Agri Found" });
		}

		req.agri = agri;

		next();
	} catch (e) {
		res.status(500).json({
			message: "Some error Occur in Agri Protect Route",
		});
		console.log("Some error Occur in Protect Route", e.message);
	}
};

export default AgriProtectRoute;
