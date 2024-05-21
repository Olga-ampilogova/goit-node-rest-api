import jwt, { decode } from "jsonwebtoken";
import {User} from "../models/users.js"

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  console.log(authorizationHeader);
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).json("Invalid token");
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);
  console.log({ bearer, token });

  if (bearer !== "Bearer") {
    return res.status(401).json("Invalid token");
    }
    jwt.verify(token, process.env.JWT_SECRET, async(error, decode) => {
        if (error) {
            return res.status(401).json("Invalid token");
      }
      try {
        const user = await User.findById(decode.id);
      
        if (user === null) {
           return res.status(401).json("Invalid token");
        }
        if (user.token !== token) {
           return res.status(401).json("Invalid token");
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
