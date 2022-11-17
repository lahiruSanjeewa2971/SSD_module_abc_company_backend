const userCtrl = require("../controllers/UserCtrl");
require("dotenv").config();
const mongoose = require("mongoose");
describe("Should login", () => {
  it("Login",function(){
        async() => {
            const newUser = {
                userName:"hiruni",
                password:"123456"
            }
            const newuser =  await userCtrl.login(newUser);
            expect(newuser.userName).toEqual("hiruni");
            expect(newuser.password).toEqual("123456");
        }
    } );
    
})