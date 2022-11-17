const userCtrl = require("../controllers/UserCtrl");
require("dotenv").config();
const mongoose = require("mongoose");
describe("Should register a user", () => {
  it("Register user",function(){
        async() => {
            const newUser = {
                fullName:"Hiruni Malshika",
                userName:"hiruni",
                password:"123456"
            }
            const newuser =  await userCtrl.register(newUser);
            expect(newuser.fullName).toEqual("Hiruni Malshika");
            expect(newuser.userName).toEqual("hiruni");
            expect(newuser.password).toEqual("123456");
        }
    } );
    
})