const Users = require("../models/UserModel");
const responseformat = require("../utils/responsformat");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const login = async (req, res) => {
  try {
    const { userid, password } = req.body;

    //validate string
    useridTrim = userid.trim();
    passwordTrim = password.trim();
    useridTrim = useridTrim.replace(/\s/g, "");
    passwordHash = md5(passwordTrim);

    //get user data
    Users.getUserdata(userid, passwordHash).then(function (value) {
      // console.log(value[0].userid);
      // console.log(value[0].password);
      // console.log(value[0].nama);
      if (Object.keys(value).length == 0) {
        responseformat(404, "not ok", "User not found", res);
      } else {
        const userid = { userid: value[0].userid };
        const accessToken = jwt.sign(userid, process.env.ACCESS_TOKEN_SECRET);
        const data = { nama: value[0].nama, accessToken: accessToken };
        responseformat(200, data, "ok", res);
      }
    });
  } catch (error) {
    responseformat(404, "not ok", "User not found", res);
    //console.log(error.message);
  }
};

const register = async (req, res) => {
  try {
    const { userid } = req.userid;
    console.log(userid);
  } catch (error) {
    responseformat(404, "not ok", "User not Create", res);
    //console.log(error.message);
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      nik: user.ID,
      name: user.first_name,
      typeUser: user.typeUser,
      department: user.department,
    },
    "kunciRahasia",
    {
      // expiresIn: "5s",
    }
  );
};

// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { id: user.id, isAdmin: user.isAdmin },
//     "kunciRahasiaRefresh"
//   );
// };

const Auth = async (req, res) => {
  const { nik, password } = req.body;
  try {
    const getPassword = await Users.findOne({
      where: {
        ID: nik,
      },
      attributes: ["pass"],
      raw: true,
    });
    //compare data
    bcrypt.compare(password, getPassword.password, async (err, cmpres) => {
      if (cmpres) {
        //get data
        const userData = await Users.findOne({
          where: {
            ID: nik,
          },
          attributes: ["ID", "first_name", "typeUser", "department"],
          raw: true,
        });
        //console.log(userData.nik);
        const accessToken = generateAccessToken(userData);
        //console.log(accessToken);
        responseformat(200, accessToken, "ok", res);
      } else {
        responseformat(401, "", "Password not Correct", res);
      }
    });
  } catch (error) {
    responseformat(404, "", "Not Found", res);
    //    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  const nik = req.params.nik;
  console.log(nik);
  const user = await Users.findOne({
    where: {
      nik: nik,
    },
  });

  if (!user) {
    responseformat(404, user, "Data not found", res);
  } else {
    try {
      await Users.destroy({
        where: {
          nik: nik,
        },
      });
      responseformat(200, user, "ok", res);
    } catch (error) {
      console.log(error.message);
    }
  }
};

const getAlluser = async (req, res) => {
  try {
    const response = await Users.findAll();
    responseformat(200, response, "ok", res);
  } catch (error) {
    console.log(error.message);
  }
};

// Export of all methods as object
module.exports = {
  //getAlluser,
  Auth,
  login,
  register,
  deleteUser,
};
