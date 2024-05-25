import jwt, { decode } from "jsonwebtoken";
import {User} from "../models/users.js"

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).json({message: "Not authorized"});
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  console.log({ bearer, token });

  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async(error, decode) => {
        if (error) {
            return res.status(401).json({ message: "Not authorized" });
      }
      try {
        const user = await User.findById(decode.id);
        if (user === null) {
           return res.status(401).json({ message: "Not authorized" });
        }
        if (user.token !== token) {
           return res.status(401).json({ message: "Not authorized" });
        }
        console.log({ decode });
        req.user = {
          id: decode.id,
        };
        next();
      } catch (error) {
        next(error)
      }
    })
}

export default auth;
